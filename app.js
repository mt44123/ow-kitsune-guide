const API_URL = "https://script.google.com/macros/s/AKfycbxLKxHCKL4IxWOsPNaREXHZ6ogng64n3tbC3RPzaKYfkybQpC7kI6rCgRY7JzAxJz6P/exec";

fetch(API_URL + "?view=new")
  .then(res => res.json())
  .then(data => {
    console.log(data);

    document.body.insertAdjacentHTML(
      "beforeend",
      "<pre style='color:#f99e1a; white-space:pre-wrap;'>" +
      JSON.stringify(data.players.slice(0, 3), null, 2) +
      "</pre>"
    );
  });
