import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ShowLoading, HideLoading } from "../../redux/alerts.js";
import { SetStudent } from "../../redux/students.js";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "./DefaultLayout.js";

function ProtectedStudentRoute(props) {
  const navigate = useNavigate();
  const [readyToRednder, setReadyToRednder] = React.useState(false);
  const dispatch = useDispatch();
  
  // This function is not used in the provided logic, but keeping it in case it's needed elsewhere.
  const enableFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const geEmployeeData = async () => {
    try {
      dispatch(ShowLoading()); // Show spinner before starting the request
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/student/get-student-by-id`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        dispatch(SetStudent(response.data.data));
        setReadyToRednder(true);
      } else {
        // Handle API error where success is false
        localStorage.removeItem("token");
        navigate("/auth/student/login");
      }
    } catch (error) {
      // Handle network or other errors
      localStorage.removeItem("token");
      navigate("/auth/student/login");
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

export default ProtectedStudentRoute;