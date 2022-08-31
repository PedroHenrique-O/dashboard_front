import { useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import Loading from "react-loading";
import { CountsType, options } from ".";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { LoadingComponent } from "../components/Loading";
import { SideNav } from "../components/SideNav";
import { api } from "../services/api";

export interface ModalityType {
  ["EDUCAÇÃO PRESENCIAL"]: EducaoPresencial;
  ["EDUCAÇÃO A DISTÂNCIA"]: EducaoADistncia;
}

export interface EducaoPresencial {
  quantity: number;
  courses: string[];
}

export interface EducaoADistncia {
  quantity: number;
  courses: string[];
}

export interface CourseWithStudentsType {
  coursesWithStudents: CoursesWithStudent[];
  courseWithMoreStudents: string;
}

export interface CoursesWithStudent {
  name: string;
  _count: Count;
}

export interface Count {
  Students: number;
}

export default function Students() {
  const [modality, setModality] = useState<ModalityType>();
  const [courseWithStudentes, setCourseWithStudentes] =
    useState<CourseWithStudentsType>();

  const [counts, setCounts] = useState<CountsType>();

  const getCounts = async () => {
    const { data: countsResponse } = await api.get("/v1");
    setCounts(countsResponse);
  };

  const getMoreUsedModalities = async () => {
    const { data: getMoreUsedModalitiesResponse } = await api.get<ModalityType>(
      "/v1/courses/modality"
    );
    console.log(getMoreUsedModalitiesResponse);
    setModality(getMoreUsedModalitiesResponse);
  };

  const getCourseWithStudents = async () => {
    const { data: courseWithMoreStudents } =
      await api.get<CourseWithStudentsType>("/v1/courses/students");
    setCourseWithStudentes(courseWithMoreStudents);
    console.log(courseWithMoreStudents);
  };

  useEffect(() => {
    getMoreUsedModalities();
    getCounts();
    getCourseWithStudents();
  }, []);

  const [presencial, distancia] = useMemo(() => {
    const EducaoPresencial = modality?.["EDUCAÇÃO PRESENCIAL"]?.quantity ?? [];
    const edDistancia = modality?.["EDUCAÇÃO A DISTÂNCIA"]?.quantity ?? [];
    return [EducaoPresencial, edDistancia];
  }, [modality]);

  const renderChart = () => (
    <Chart
      className="bg-black mt-6"
      chartType="PieChart"
      options={{
        ...options,
        backgroundColor: "transparent",
        is3D: true,
      }}
      style={{
        background: "transparent",
        width: "97%",
        height: "200px",
        borderRadius: "50px",
      }}
      data={[
        ["Cursos por Campus", "Alunos"],
        ["EDUCAÇÃO PRESENCIAL", presencial],
        ["EDUCAÇÃO A DISTÂNCIA", distancia],
      ]}
    />
  );
  const [getCoursesWithStudents] = useMemo(() => {
    const courses = courseWithStudentes?.coursesWithStudents ?? [];

    return [courses.map((course) => [course.name, course._count.Students])];
  }, [courseWithStudentes?.coursesWithStudents]);

  if (!counts || !courseWithStudentes || !modality) {
    return <LoadingComponent type="spinningBubbles" color="#124845" />;
  }

  return (
    <>
      <SideNav />
      <div className="container mx-auto relative">
        <Header />
        <div className="grid mx-auto grid-cols-3">
          <Card count={renderChart()} title="Campus" />
          <Card count={counts?.allCourses} title="Campus com mais cursos" />
          <Card
            classNameSubtitle="!text-4xl"
            count={courseWithStudentes?.courseWithMoreStudents}
            title="Campus com mais alunos"
          />
        </div>

        <Chart
          legendToggle
          legend_toggle
          className="bg-black mt-6 shadow-2xl "
          chartType="AreaChart"
          options={{
            ...options,
            title: "Alunos por Curso - Top 10",
            is3D: true,
          }}
          style={{
            width: "97%",
            height: "400px",
            borderRadius: "50px",
          }}
          data={[
            ["Alunos por Curso - Top 10", "Alunos"],
            ...[...getCoursesWithStudents],
          ]}
        />
      </div>
    </>
  );
}
