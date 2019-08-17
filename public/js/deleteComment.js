import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const formsDeleteComment = document.querySelectorAll('.eliminar-comentario');

    if (formsDeleteComment.length > 0) {
        formsDeleteComment.forEach((form) => {
            form.addEventListener('submit', deleteComment);
        })
    }
});

function deleteComment(e) {
    e.preventDefault();

    Swal.fire({
        title: '¿Estás seguro?',
        text: "Una vez que se elimina un comentario no se puede recuperar!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar comentario!',
        cancelButtonText: 'No, cancelar',
        allowOutsideClick: false
    }).then((result) => {
        if (result.value) {
            /* tomar el id del comentario */
            const commentId = this.children[0].value;
            const meetiId = this.children[1].value;
            /* objeto que vamos a pasar a axios */
            const data = { commentId, meetiId };
            
            /* enviar la peticion con axios */
            axios.post(this.action, data)
                .then((resp) => {
                    if (resp.status === 200) {
                        Swal.fire(
                            'Comentario eliminado!',
                            resp.data,
                            'success'
                        );
                        
                        const parentContainer = this.parentElement.parentElement.parentElement;
                        const childContainer = this.parentElement.parentElement;
                        parentContainer.removeChild(childContainer);
                    }
                }).catch((err) => {
                    console.log({ err });
                    Swal.fire(
                        'Hubo un error',
                        'No fue posible realizar la operación solicitada',
                        'error'
                    );
                });
        }
    });

}