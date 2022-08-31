import { useCallback, useEffect, useMemo, useState } from "react";
import { Chart } from "react-google-charts";
import { CountsType, options } from ".";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { LoadingComponent } from "../components/Loading";
import { SideNav } from "../components/SideNav";
import { api } from "../services/api";

export interface ResponseEnrollmentsByDateType {
  responseEnrollmentsByDate: Dates;
}

export interface Dates {
  "03-2021": number;
  "04-2021": number;
  "05-2021": number;
  "06-2021": number;
  "07-2021": number;
  "08-2021": number;
  "09-2021": number;
  "10-2021": number;
  "11-2021": number;
  "12-2021": number;
  "01-2022": number;
}

export interface EnrollmentsByStatusType {
  enrollmentsByStatus: EnrollmentsByStatus;
  entranceAndExit: EntranceAndExit;
}

export interface EnrollmentsByStatus {
  em_curso: number;
  transf_ext: number;
  desligado: number;
  concluída: number;
  reprovada: number;
  abandono: number;
}

export interface EntranceAndExit {
  entrance: number;
  exit: number;
}

export default function Enrollments() {
  const [counts, setCounts] = useState<CountsType>();
  const [responseEnrollmentsByDate, setResponseEnrollmentsByDate] =
    useState<ResponseEnrollmentsByDateType>();
  const [enrollByStatus, setEnrollByStatus] =
    useState<EnrollmentsByStatusType>();

  const getCounts = async () => {
    const { data: countsResponse } = await api.get("/v1");
    setCounts(countsResponse);
  };

  const getStudentsByEnrollDate = async () => {
    const { data: studentsByEnrollDateResponse } =
      await api.get<ResponseEnrollmentsByDateType>(
        `/v1/students/enrollments-date`
      );

    setResponseEnrollmentsByDate(studentsByEnrollDateResponse);
  };

  const getStudentEnrollStatus = async () => {
    const { data: studentsStatusResponse } =
      await api.get<EnrollmentsByStatusType>(`/v1/students/status`);
    setEnrollByStatus(studentsStatusResponse);
  };

  const [studentsKeys, studentsValues] = useMemo(() => {
    const enrollsByDate =
      responseEnrollmentsByDate?.responseEnrollmentsByDate ?? ({} as Dates);

    const keys = Object.keys(enrollsByDate);
    const values = Object.values(enrollsByDate);

    return [keys, values];
  }, [responseEnrollmentsByDate?.responseEnrollmentsByDate]);

  const [enrollmentsKeys, enrollmentsValues, enrolls, leaves] = useMemo(() => {
    const enrollsByStatus =
      enrollByStatus?.enrollmentsByStatus ?? ({} as EnrollmentsByStatus);

    const entries = enrollByStatus?.entranceAndExit.entrance ?? 0;
    const leaves = enrollByStatus?.entranceAndExit.exit ?? 0;
    const keys = Object.keys(enrollsByStatus);
    const values = Object.values(enrollsByStatus);

    return [keys, values, entries, leaves];
  }, [
    enrollByStatus?.enrollmentsByStatus,
    enrollByStatus?.entranceAndExit.entrance,
    enrollByStatus?.entranceAndExit.exit,
  ]);

  const renderChart = () => (
    <Chart
      className="bg-black mt-6"
      chartType="PieChart"
      options={{
        ...options,
        colors: undefined,

        title: "Status por aluno",
        is3D: true,
      }}
      style={{
        width: "99%",
        height: "150px",
        borderRadius: "50px",
      }}
      data={[
        ["Status por aluno", "Cursos"],
        ...enrollmentsKeys.map((key, index) => [key, enrollmentsValues[index]]),
      ]}
    />
  );

  useEffect(() => {
    getCounts();
    getStudentsByEnrollDate();
    getStudentEnrollStatus();
  }, []);

  if (!counts || !responseEnrollmentsByDate || !enrollByStatus) {
    return <LoadingComponent type="spinningBubbles" color="#124845" />;
  }

  return (
    <>
      <SideNav />
      <div className="container mx-auto relative">
        <Header />
        <div className="grid mx-auto grid-cols-3">
          <Card count={renderChart()} title="Campus" />
          <Card
            title="Entradas e Saidas 2021-Atual"
            count={`${enrolls}/${leaves}`}
          />
          <Card title="Alunos" count={counts?.allStudents} />
        </div>

        <Chart
          className="bg-black mt-6 shadow-2xl"
          chartType="AreaChart"
          options={{
            ...options,
            title: "Matrículas por data",
            is3D: true,
            backgroundColor: "#33363E",
          }}
          style={{
            width: "97%",
            color: "#ffffff",
            borderRadius: 50,
            height: "400px",
          }}
          data={[
            ["Matrículas por data", "Cursos"],
            ...studentsKeys.map((key, index) => [key, studentsValues[index]]),
          ]}
        />
      </div>
    </>
  );
}
