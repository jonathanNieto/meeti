import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const assistance = document.querySelector('#confirm-assistance');

    if (assistance) {
        assistance.addEventListener('submit', confirmAssistance);
    }
});

function confirmAssistance(e) {
    
    e.preventDefault();

    console.log(this);

    return

    axios.post(this.action)
        .then((resp) => {
            console.log({resp});
        })
}