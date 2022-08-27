import { useEffect } from "react";
import { api } from "../services/api";

export default function Home() {
  const getCounts = async () => {
    const { data: countsResponse } = await api.get("/v1");
    console.log({ countsResponse });
  };
  const getCourses = async () => {
    const { data: coursesResponse } = await api.get("/v1/campus/courses");
    console.log({ coursesResponse });
  };
  const getStudents = async () => {
    const { data: studentsResponse } = await api.get("/v1/courses/students");
    console.log({ studentsResponse });
  };
  useEffect(() => {
    getCounts();
    getCourses();
    getStudents();
  }, []);

  return (
    <div>
      <h1 className="text-gray-600 flex justify-center font-semibold text-xl">
        Dashboard
      </h1>
    </div>
  );
}
