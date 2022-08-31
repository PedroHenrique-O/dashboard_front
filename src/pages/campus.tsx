import { useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import ReactLoading from "react-loading";
import { CountsType, options, StudentsByCampusType } from ".";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { LoadingComponent } from "../components/Loading";
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

  if (!counts || !studentsByCampus || !campusWithMoreCourses) {
    return (
      <LoadingComponent
        type="spinningBubbles"
        color="#124845"
        width={"50%"}
        height="50%"
      />
    );
  }

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
          className="bg-black mt-6 shadow-2xl "
          chartType="AreaChart"
          options={{
            ...options,
            title: "Cursos por Campus",
            is3D: true,
          }}
          style={{
            width: "97%",
            height: "400px",
            borderRadius: "50px",
          }}
          data={[["Cursos por Campus", "Alunos"], ...[...getCoursesByCampus]]}
        />
      </div>
    </>
  );
}
