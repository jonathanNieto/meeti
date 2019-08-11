import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {

    const groupList = document.querySelector('.groups');
    const meetiList = document.querySelector('.meetis');
    const oldMeetiList = document.querySelector('.oldmeetis');

    if (groupList) {
        groupList.addEventListener('click', (e) => {
            e.preventDefault();
            const gridContainer = e.target.parentElement.parentElement.parentElement;
            const gridItem = e.target.parentElement.parentElement;

            /* en caso de hacer click en el boton de eliminar */
            if (e.target.dataset.delete) {
                /* eliminamos el grupo de la DB con axios */
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Una vez que se elimina un grupo no se puede recuperar!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar grupo!',
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        /* enviar la peticion con axios */
                        const url = `${location.origin}/user/delete-group/${e.target.dataset.delete}`;

                        axios.delete(url, { params: url })
                            .then(function (response) {
                                console.log({ response })
                                if (response.status === 200) {

                                    Swal.fire(
                                        'Grupo eliminado!',
                                        response.data,
                                        'success'
                                    )

                                    /* TODO:  eliminar del DOM */
                                    gridContainer.removeChild(gridItem);
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
            } else if (e.target.tagName === 'A') {
                /* en caso contrario, sigue su curso normal con los links de cada enlace */
                window.location.href = e.target.href;
            } else if (e.target.tagName === 'IMG') {
                /* en caso contrario, sigue su curso normal con los links de cada imagen */
                if (e.target.parentElement.tagName === 'A') {
                    window.location.href = e.target.parentElement.href;
                }
            }
        });
    }
    if (meetiList) {
        meetiList.addEventListener('click', (e) => {
            e.preventDefault();
            const gridContainer = e.target.parentElement.parentElement.parentElement;
            const gridItem = e.target.parentElement.parentElement;

            /* en caso de hacer click en el boton de eliminar */
            if (e.target.dataset.delete) {
                /* eliminamos el grupo de la DB con axios */
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Una vez que se elimina un meeti no se puede recuperar!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar meeti!',
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        /* enviar la peticion con axios */
                        const url = `${location.origin}/user/delete-meeti/${e.target.dataset.delete}`;

                        axios.delete(url, { params: url })
                            .then(function (response) {
                                console.log({ response })
                                if (response.status === 200) {

                                    Swal.fire(
                                        'Grupo eliminado!',
                                        response.data,
                                        'success'
                                    )

                                    /* TODO:  eliminar del DOM */
                                    gridContainer.removeChild(gridItem);
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
            } else if (e.target.tagName === 'A') {
                /* en caso contrario, sigue su curso normal con los links de cada enlace */
                window.location.href = e.target.href;
            } 
        });
    }
    if (oldMeetiList) {
        oldMeetiList.addEventListener('click', (e) => {
            e.preventDefault();
            const gridContainer = e.target.parentElement.parentElement.parentElement;
            const gridItem = e.target.parentElement.parentElement;

            console.log(gridContainer)
            console.log(gridItem)

            /* en caso de hacer click en el boton de eliminar */
            if (e.target.dataset.delete) {
                /* eliminamos el grupo de la DB con axios */
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "Una vez que se elimina un meeti no se puede recuperar!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar meeti!',
                    cancelButtonText: 'No, cancelar',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        /* enviar la peticion con axios */
                        const url = `${location.origin}/user/delete-meeti/${e.target.dataset.delete}`;

                        axios.delete(url, { params: url })
                            .then(function (response) {
                                console.log({ response })
                                if (response.status === 200) {

                                    Swal.fire(
                                        'Grupo eliminado!',
                                        response.data,
                                        'success'
                                    )

                                    /* TODO:  eliminar del DOM */
                                    gridContainer.removeChild(gridItem);
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
            } else if (e.target.tagName === 'A') {
                /* en caso contrario, sigue su curso normal con los links de cada enlace */
                window.location.href = e.target.href;
            } 
        });
    }
    
});