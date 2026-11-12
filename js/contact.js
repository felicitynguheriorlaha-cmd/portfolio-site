/* Contact form validation:
   - no field may be empty
   - email must have a valid format
   - phone number must contain digits only */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  var success = document.getElementById("form-success");

  var fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    message: document.getElementById("message")
  };

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var digitsPattern = /^[0-9]+$/;

  function setError(key, msg) {
    document.getElementById(key + "-error").textContent = msg;
    fields[key].classList.toggle("invalid", msg !== "");
    fields[key].classList.toggle("valid", msg === "" && fields[key].value.trim() !== "");
    fields[key].setAttribute("aria-invalid", msg !== "" ? "true" : "false");
  }

  function validateField(key) {
    var value = fields[key].value.trim();
    var msg = "";

    if (value === "") {
      msg = "This field cannot be empty.";
    } else if (key === "email" && !emailPattern.test(value)) {
      msg = "Please enter a valid email address (e.g. name@example.com).";
    } else if (key === "phone" && !digitsPattern.test(value)) {
      msg = "Phone number must contain digits only.";
    }

    setError(key, msg);
    return msg === "";
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener("blur", function () { validateField(key); });
    fields[key].addEventListener("input", function () {
      if (fields[key].classList.contains("invalid")) validateField(key);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    success.classList.remove("show");

    var allValid = true;
    Object.keys(fields).forEach(function (key) {
      if (!validateField(key)) allValid = false;
    });

    if (!allValid) {
      var firstBad = form.querySelector(".invalid");
      if (firstBad) firstBad.focus();
      return;
    }

    // Simulated send (no backend in this project)
    success.classList.add("show");
    form.reset();
    Object.keys(fields).forEach(function (key) {
      fields[key].classList.remove("valid", "invalid");
    });
  });
})();
