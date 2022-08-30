import { useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import { CountsType, StudentsByCampusType } from ".";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { SideNav } from "../components/SideNav";
import { api } from "../services/api";

export interface CampusWithMoreCoursesType {
  campusWithCourses: CampusWithCourse[];
  campusWithMoreCourses: string;
}

export interface CampusWithCourse {
  name: string;
  _count: Count;
}

export interface Count {
  courses: number;
}

export default function Campus() {
  const [studentsByCampus, setStudentsByCampus] =
    useState<StudentsByCampusType>();
  const [counts, setCounts] = useState<CountsType>();
  const [campusWithMoreCourses, setCampusWithMoreCourses] =
    useState<CampusWithMoreCoursesType>();

  const getCounts = async () => {
    const { data: countsResponse } = await api.get("/v1");
    setCounts(countsResponse);
  };
  const getStudentsByCampus = async () => {
    const { data: studentsByCampusResponse } =
      await api.get<StudentsByCampusType>(`/v1/students/campus`);
    console.log(studentsByCampusResponse);

    setStudentsByCampus(studentsByCampusResponse);
  };

  const getCampusWithMoreStudedents = async () => {
    const { data: campusWithMoreStudedents } = await api.get(
      `/v1/campus/courses`
    );
    setCampusWithMoreCourses(campusWithMoreStudedents);
    console.log(campusWithMoreStudedents);
  };

  const [getCoursesByCampus] = useMemo(() => {
    const coursesByCampus = campusWithMoreCourses?.campusWithCourses ?? [];

    return [
      coursesByCampus?.map((campus) => [campus.name, campus._count.courses]),
    ];
  }, [campusWithMoreCourses?.campusWithCourses]);

  useEffect(() => {
    getCounts();
    getStudentsByCampus();
    getCampusWithMoreStudedents();
  }, []);

  return (
    <>
      <SideNav />
      <div className="container mx-auto relative">
        <Header />
        <div className="grid mx-auto grid-cols-3">
          <Card count={counts?.allCampus ?? 0} title="Campus" />
          <Card
            classNameSubtitle="!text-4xl"
            count={campusWithMoreCourses?.campusWithMoreCourses}
            title="Campus com mais cursos"
          />
          <Card
            classNameSubtitle="!text-4xl"
            title="Campus com mais alunos"
            count={studentsByCampus?.campusWithMoreStudents.name}
          />
        </div>

        <Chart
          className="bg-black mt-6"
          chartType="AreaChart"
          options={{
            title: "Alunos por Campus",
            is3D: true,
            colors: ["#124845"],
          }}
          style={{
            width: "97%",
            height: "400px",
            borderRadius: "50px",
          }}
          data={[["Alunos por Campus", "Alunos"], ...[...getCoursesByCampus]]}
        />
      </div>
    </>
  );
}
