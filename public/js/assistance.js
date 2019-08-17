import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {

    const assistance = document.querySelector('#confirm-assistance');

    if (assistance) {
        assistance.addEventListener('submit', confirmAssistance);
    }
});

function confirmAssistance(e) {

    e.preventDefault();
    const btn = document.querySelector('#confirm-assistance input[type="submit"]');
    let accion = document.querySelector('#accion').value;

    axios.post(this.action, { data: accion })
        .then((resp) => {
            if (accion === 'confirmar') {
                document.querySelector('#accion').value = 'cancelar';
                btn.value = 'Cancelar';
                btn.classList.remove('btn-azul');
                btn.classList.add('btn-rojo');
            } else {
                document.querySelector('#accion').value = 'confirmar';
                btn.value = 'Si';
                btn.classList.remove('btn-rojo');
                btn.classList.add('btn-azul');
            }
            Swal.fire({
                type: 'success',
                title: resp.data,
                showConfirmButton: false,
                timer: 1500
            })
            console.log({ resp });
        })
}