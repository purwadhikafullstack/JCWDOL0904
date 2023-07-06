import Swal from "sweetalert2";

const Alert = ({title, text, icon}) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: "Ok",
    confirmButtonColor: "black",
  });
};

export default Alert;
