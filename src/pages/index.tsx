import { useCallback, useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import { Header } from "../components/Header";

import { ColumnDefinitionType } from "../components/TableComponent";
import { api } from "../services/api";

export interface StudentsType {
  id: string;
  name: string;
  campusId: string;
  attributeId: string;
  created_at: string;
  _count: {
    Students: number;
  };
}

export interface CoursesType {
  id: string;
  name: string;
}

export default function Home() {
  const [students, setStudents] = useState<StudentsType[]>([]);
  const [courses, setCourses] = useState<CoursesType[]>([]);
  const getCounts = async () => {
    const { data: countsResponse } = await api.get("/v1");
    console.log({ countsResponse });
  };
  const getCourses = async () => {
    const { data: coursesResponse } = await api.get("/v1/campus/courses");
    setCourses(coursesResponse);
    console.log({ coursesResponse });
  };
  const getStudents = async () => {
    const { data: studentsResponse } = await api.get<StudentsType[]>(
      "/v1/courses/students"
    );
    setStudents(studentsResponse);
    console.log({ studentsResponse });
  };

  const getModalities = async () => {
    const { data: modalitiesResponse } = await api.get("/v1/courses/modality");
    console.log({ modalitiesResponse });
  };

  const getStudentsByDate = useCallback(async () => {
    const start = "2014/01/01";
    const end = "2022/01/31";
    const { data: studentsByDateResponse } = await api.get(
      `/v1/students/date?start=${start}&end=${end}`
    );
    console.log({ studentsByDateResponse });
  }, []);

  const getStudentsByEnrollStatus = async () => {
    const { data: studentsByEnrollStatusResponse } = await api.get(
      `/v1/students/status`
    );
    console.log({ studentsByEnrollStatusResponse });
  };

  useEffect(() => {
    getStudents();
    getCourses();
    // getModalities();
    //getStudentsByDate();
  }, [getStudentsByDate]);

  const columnsCourses: ColumnDefinitionType<
    Pick<CoursesType, "name">,
    keyof Pick<CoursesType, "name">
  >[] = [
    {
      key: "name",
      header: "Courses",
    },
  ];
  const courseCounts = useMemo(() => {
    return students
      .slice(0, 5)
      .map((student) => [student.name, student._count.Students]);
  }, [students]);

  return (
    <div className="container mx-auto">
      <Header />
      <Chart
        legend_toggle
        chartType="AreaChart"
        data={[["Curso", "Quantidade"], ...courseCounts]}
        width="100%"
        height="400px"
        legendToggle
      />
    </div>
  );
}
