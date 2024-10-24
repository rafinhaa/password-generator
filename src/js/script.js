const charTypeMap = {
  include_uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  include_lowercase: "abcdefghijklmnopqrstuvwxyz",
  include_number: "0123456789",
  include_special_character: "!@#$%^&*()_+-=[]{}'|;:,.<>?",
};

const createPasswordGenerator = (checks) => {
  const charTypes = checks.map(({ id }) => charTypeMap[id] || "");

  return (size) => {
    return (randomChar) =>
      Array.from({ length: size }, () => randomChar(charTypes)).join("");
  };
};

function randomCharType(charTypes) {
  const randomIndex = Math.floor(Math.random() * charTypes.length);
  const randomCharType = Math.floor(
    Math.random() * charTypes[randomIndex].length
  );

  const chars = charTypes[randomIndex];
  const randomChar = chars[randomCharType];

  return randomChar;
}

function getPasswordSize() {
  const size = document.querySelector("#size").value;

  if (!isNaN(size) && size >= 8 && size <= 256) {
    return size;
  }
}

function message(text, type = "success") {
  const background = {
    success: "var(--color-primary-1)",
    error: "var(--error-color)",
  }[type];

  return Toastify({
    text,
    duration: 1500,
    style: {
      background,
      boxShadow: "none",
    },
  }).showToast();
}

function getSelectedCharsOptions() {
  return [...document.querySelectorAll("input[type=checkbox]")].filter(
    ({ checked }) => checked
  );
}

document.getElementById("generate").addEventListener("click", () => {
  const selectedChecks = getSelectedCharsOptions();
  if (!selectedChecks.length)
    return message(
      "Por favor, selecione pelo menos um tipo de caractere!",
      "error"
    );

  const size = getPasswordSize();
  if (!size)
    return message("Por favor, insira um tamanho entre 8 e 256!", "error");

  const generatePassword = createPasswordGenerator(selectedChecks);
  const passwordGenerated = generatePassword(size)(randomCharType);

  document.querySelector("#password_container").classList.add("show");

  document.querySelector("#password").innerText = passwordGenerated;
});

document.getElementById("copy").addEventListener("click", () => {
  navigator.clipboard.writeText(document.querySelector("#password").innerText);
  message("Senha copiada com sucesso!");
});
