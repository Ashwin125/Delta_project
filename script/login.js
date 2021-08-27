let i = 0;
let txt = '<Code-Editor>';
let speed = 150;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("title").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    typeWriter();
})


document.querySelector("#pass").addEventListener('keydown', (event) => {
    let password = document.querySelector('#pass').value;
    let strength = document.querySelector('#strength');
    let score = 0;

    let number = '0123456789';
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let specialChar = '~`!@#$%^&*_+=|:;,.?/'

    score += 5 * (password.length < 5);
    score += 10 * (password.length >= 5 && password.length <= 7) ;
    score += 25 * (password.length >= 8);
    
    let upperCount = count(password, upper);
    let lowerCount = count(password, lower);
    let numbers = count(password, number);
    let special = count(password, specialChar);

    let letter = upperCount + lowerCount;

    if(letter == 0) {
        score += 0;
    } else if (lowerCount == 0 || upperCount == 0) {
        score += 10;
    } else {
        score += 20;
    }

    if(numbers == 0) {
        score += 0;
    } else if (numbers >= 1 && numbers <= 2) {
        score += 10;
    } else {
        score += 20;
    }

    if(special == 0) {
        score += 0;
    } else if (special == 1) {
        score += 10;
    } else {
        score += 25;
    }

    if(letter != 0 && numbers != 0) {

        score += 2;

        if(special != 0) {

            score += 3;

            if(lowerCount != 0 && upperCount != 0) {
                score += 5;
            }
        }
    }
    
    strength.innerHTML = ' ('
    if (score > 90) {
        strength.innerHTML += "Very Secure";
    } else if (score > 80) {
        strength.innerHTML += "Secure";
    } else if (score > 70) {
        strength.innerHTML += "Very Strong";
    } else if (score > 60) {
        strength.innerHTML += "Strong";
    } else if (score > 50) {
        strength.innerHTML += "Average";
    } else if (score > 25) {
        strength.innerHTML += "Weak";
    } else {
        strength.innerHTML += "Very Weak";
    }

    strength.innerHTML += ')';

});


function count(password, str) {

    c = 0;

    for(let char of password) {
        if(str.indexOf(char) != -1) {
            c += 1;
        }
    }

    return c;
}