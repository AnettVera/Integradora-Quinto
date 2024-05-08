import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

/*
    Todos los titulos error, success, confirm
    Todos los mensajes error, success, confirm 
*/

const SweetAlert = withReactContent(Swal);

export const customAlert = (title, text, icon) => {
  return SweetAlert.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Aceptar',
  });

 
};

export const pconfirmAlert = (preConfirm) => SweetAlert.fire({
  title: '¿Estás seguro?',
  text: 'Esta acción requiere una confirmación, por favor elija una opción',
  icon: 'info',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar',
  reverseButtons: true,
  backdrop: true,
  showCancelButton: true,
  showLoaderOnConfirm: true,
  allowOutsideClick: () => !Swal.isLoading(),
  preConfirm
 })


export const confirmAlert = async (message) => {
  try {
    const result = await SweetAlert.fire({
      title: '¿Estás seguro?',
      text: message,
      icon: 'info',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true, 
 
    });

    return result.isConfirmed;
  } catch (error) {
    console.error('Error en confirmAlert:', error);
    return false;
  }
};


 