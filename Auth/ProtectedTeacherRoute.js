import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/alerts.js";
import { SetTeacher } from "../../redux/teachers.js";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "./DefaultLayout";

function ProtectedTeacherRoute(props) {
  const navigate = useNavigate();
  const [readyToRednder, setReadyToRednder] = React.useState(false);
  const dispatch = useDispatch();

  const geEmployeeData = async () => {
    try {
      dispatch(ShowLoading()); // Show spinner before starting the request
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/teacher/get-teacher-by-id`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(SetTeacher(response.data.data));
        setReadyToRednder(true);
      } else {
        // Handle API error where success is false
        localStorage.removeItem("token");
        navigate("/auth/teacher/login");
      }
    } catch (error) {
      // Handle network or other errors
      localStorage.removeItem("token");
      navigate("/auth/teacher/login");
    } finally {
      // This will always run, after the try or catch is finished
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    geEmployeeData();
  }, []);

  return readyToRednder && <DefaultLayout>{props.children}</DefaultLayout>;
}

export default ProtectedTeacherRoute;