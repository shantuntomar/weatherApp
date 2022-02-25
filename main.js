const wrapper = document.querySelector('.wrapper') , 
inputPart = wrapper.querySelector('.input-part') , 
infoText = inputPart.querySelector('.info-txt') , 
inputFeild = inputPart.querySelector('input') , 
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;

inputFeild.addEventListener('keyup' , e => {
    //if user pressed enter key and input feild is not empty 
    if(e.key == "Enter" && inputFeild.value != "") {
        requestApi(inputFeild.value);
    }
});

locationBtn.addEventListener("click" , () => {
    if(navigator.geolocation) { //if browse support geolocation api 
        navigator.geolocation.getCurrentPosition(onSuccess , onError);
    }
    else {
        alert("Your Browser not Support geolocation api")
    }
});

function onError(error) {
    infoText.innerHTML = error.message;
    infoText.classList.add("error");
}

function onSuccess(position) {
    const {latitude , longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a5cb9783dafaa7c9027b2e9e5cb12456`;
    fetchData();
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=a5cb9783dafaa7c9027b2e9e5cb12456`;
    fetchData();
}

function fetchData() {
    infoText.innerHTML = "Getting Weather Details..."
    infoText.classList.add("pending");

    //getting api response and returning it with parsing into js object and in another 
    //then function calling weatherDetails function with passing api result as an argument.
    fetch(api).then(response => response.json()).then(result => weatherDetails(result)).catch(() => {
        infoText.innerText = "Something went wrong";
        infoText.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
    if(info.cod == "404"){
        infoText.classList.replace("pending", "error");
        infoText.innerText = `${inputFeild.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }
        
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoText.classList.remove("pending", "error");
        infoText.innerText = "";
        inputFeild.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});