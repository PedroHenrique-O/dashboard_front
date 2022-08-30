import { useCallback, useEffect, useMemo, useState } from "react";
import Chart from "react-google-charts";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { SideNav } from "../components/SideNav";

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

export interface StudentsByStatusType {
  abandono: number;
  concluída: number;
  desligado: number;
  em_curso: number;
  reprovada: number;
  transf_ext: number;
}

export interface CountsType {
  allCampus: number;
  allCourses: number;
  allStudents: number;
}

export interface StudentsByCampusType {
  campusWithMoreStudents: {
    name: string;
  };

  studentsByCampusSorted: {
    ["ASSIS CHATEAUBRIAND"]: number;
    ["AVANÇADO ARAPONGAS"]: number;
    [" AVANÇADO ASTORGA"]: number;
    [" AVANÇADO BARRACÃO"]: number;
    [" AVANÇADO CORONEL VIVIDA"]: number;
    ["AVANÇADO GOIOERÊ"]: number;
    ["AVANÇADO QUEDAS DO IGUAÇU"]: number;
    ["CAMPO LARGO"]: number;
    ["CAPANEMA"]: number;
    ["CASCAVEL"]: number;
    ["COLOMBO"]: number;
    ["CURITIBA"]: number;
    ["FOZ DO IGUAÇU"]: number;
    ["IRATI"]: number;
    ["IVAIPORÃ"]: number;
    ["JACAREZINHO"]: number;
    ["JAGUARIAÍVA"]: number;
    ["LONDRINA"]: number;
    ["PALMAS"]: number;
    ["PARANAGUÁ"]: number;
    ["PARANAVAÍ"]: number;
    ["PINHAIS"]: number;
    ["PITANGA"]: number;
    ["TELÊMACO BORBA"]: number;
    ["UMUARAMA"]: number;
    ["UNIÃO DA VITÓRIA"]: number;
  };
}

export default function Home() {
  const [studentsByCampus, setStudentsByCampus] =
    useState<StudentsByCampusType>();
  const [counts, setCounts] = useState<CountsType>();

  const getCounts = async () => {
    const { data: countsResponse } = await api.get("/v1");
    setCounts(countsResponse);
  };

  const getStudentsByCampus = async () => {
    const { data: studentsByCampusResponse } =
      await api.get<StudentsByCampusType>(`/v1/students/campus`);

    setStudentsByCampus(studentsByCampusResponse);
  };

  useEffect(() => {
    getCounts();
    getStudentsByCampus();
  }, []);

  const [stundentsKeys, studentsValues] = useMemo(() => {
    const keys = Object.keys(studentsByCampus?.studentsByCampusSorted ?? {});
    const values = Object.values(
      studentsByCampus?.studentsByCampusSorted ?? {}
    );
    return [keys, values];
  }, [studentsByCampus?.studentsByCampusSorted]);

  return (
    <>
      <SideNav />
      <div className="container mx-auto relative">
        <Header />
        <div className="grid mx-auto grid-cols-3">
          <Card count={counts?.allCampus ?? 0} title="Campus" />
          <Card title="Cursos" count={counts?.allCourses ?? 0} />
          <Card title="Alunos" count={counts?.allStudents ?? 0} />
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
          data={[
            ["Cursos por Campus", "Cursos"],
            ...stundentsKeys.map((key, index) => [key, studentsValues[index]]),
          ]}
        />
      </div>
    </>
  );
}
