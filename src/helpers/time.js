const timeNow = (second = "", operator = "") => {
  let date_ob = new Date();
  if (operator == "minus") {
    date_ob = subtractSeconds(date_ob, second);
  }
  if (operator == "add") {
    date_ob = addSeconds(date_ob, second);
  }
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
};

function subtractSeconds(date, seconds) {
  date.setSeconds(date.getSeconds() - seconds);
  return date;
}

function addSeconds(date, seconds) {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

function addMonths(date, months) {
  date.setMonth(date.getMonth() + months);
  return date;
}

function addYears(date, year) {
  date.setFullYear(date.getFullYear() + year);
  return date;
}

const getExpiryDate = async (created_date, duration, type) => {
  let date_ob = new Date(created_date);
  date_ob =
    type == "Month"
      ? addMonths(date_ob, duration)
      : addYears(date_ob, duration);
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
};

const getAddMonth = async (created_date, duration) => {
  let date_ob = new Date(created_date);
  date_ob = addMonths(date_ob, duration);
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  return year + "-" + month + "-" + date;
};

const getDate = () => {
  var today = new Date();
  var year = today.getFullYear();
  var mes = today.getMonth() + 1;
  var dia = today.getDate();
  var fecha = dia + "-" + mes + "-" + year;
  return fecha;
};

const getDateUS = () => {
  var today = new Date();
  var year = today.getFullYear();
  var mes = ("0" + (today.getMonth() + 1)).slice(-2);
  var dia = ("0" + today.getDate()).slice(-2);
  var fecha = year + "-" + mes + "-" + dia;
  return fecha;
};

const getDateTime = () => {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var seconds = today.getSeconds();
  return (
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
};
const getNumberOfDays = (date1, date2) => {
  let date_1 = new Date(date1);
  let date_2 = new Date(date2);
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
};

module.exports = {
  timeNow,
  getDate,
  getDateUS,
  getDateTime,
  getAddMonth,
  getExpiryDate,
  getNumberOfDays,
};
