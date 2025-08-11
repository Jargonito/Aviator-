function register() {
  const user = document.getElementById('registerUser').value;
  const pass = document.getElementById('registerPass').value;

  if (user && pass) {
    localStorage.setItem(`user_${user}`, pass); // Corrigido: interpolação correta
    alert('Cadastro realizado com sucesso!');
} else {
    alert('Preencha todos os campos.');
}
}

function login() {
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  const storedPass = localStorage.getItem(`user_${user}`); // Corrigido: interpolação correta

  if (pass === storedPass) {
    localStorage.setItem('currentUser', user);
    const saldoKey = `saldo_${user}`;
    localStorage.setItem(saldoKey, localStorage.getItem(saldoKey) || 100); // Inicializa saldo se não existir

    document.getElementById('auth').style.display = 'none';
    document.getElementById('main').style.display = 'block';
    document.getElementById('userInfo').innerText = `Bem-vindo, ${user}`;
    showSection('aviator');
} else {
    alert('Usuário ou senha incorretos.');
}
}

function logout() {
  localStorage.removeItem('currentUser');
  location.reload();
}

function atualizarSaldo() {
  const user = localStorage.getItem('currentUser');
  const saldo = parseFloat(localStorage.getItem(`saldo_${user}`)) || 0;
  document.getElementById('saldo').innerText = `Saldo: ${saldo.toFixed(2)} MZN`; // Corrigido: interpolação correta
}
function showSection(id) {
  document.querySelectorAll('.game-section').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
let aviatorInterval;
let aviatorMultiplicador = 1.0;
let aviatorAposta = 0;
let aviatorAtivo = false;

function startAviator() {
  if (aviatorAtivo) return;

  const user = localStorage.getItem('currentUser');
  let saldo = parseFloat(localStorage.getItem(`saldo_${user}`)); // Corrigido
  const valor = parseFloat(document.getElementById("aviatorBet").value);
  const status = document.getElementById("aviatorStatus");

  if (!valor || valor <= 0 || valor> saldo) {
    status.innerText = "Valor inválido ou saldo insuficiente.";
    return;
}

  saldo -= valor;
  localStorage.setItem(`saldo_${user}`, saldo); // Corrigido
  atualizarSaldo();

  aviatorMultiplicador = 1.0;
  aviatorAposta = valor;
  aviatorAtivo = true;
  document.getElementById("aviatorCashout").style.display = "block";
  status.innerText = `✈️ Multiplicador: x${aviatorMultiplicador.toFixed(2)}`; // Corrigido

  aviatorInterval = setInterval(() => {
    aviatorMultiplicador += Math.random() * 0.2;
    status.innerText = `✈️ Multiplicador: x${aviatorMultiplicador.toFixed(2)}`; // Corrigido

    // Chance de crash a cada ciclo
    if (Math.random() < 0.03 + (aviatorMultiplicador / 100)) {
      clearInterval(aviatorInterval);
      status.innerText = `💥 Avião caiu em x${aviatorMultiplicador.toFixed(2)}. Você perdeu ${aviatorAposta} MZN`; // Corrigido
      document.getElementById("aviatorCashout").style.display = "none";
      aviatorAtivo = false;
}
}, 500);
}

function cashoutAviator() {
  if (!aviatorAtivo) return;

  clearInterval(aviatorInterval);
  const user = localStorage.getItem('currentUser');
  let saldo = parseFloat(localStorage.getItem(`saldo_${user}`)); // Corrigido
  const ganho = aviatorAposta * aviatorMultiplicador;
  saldo += ganho;
  localStorage.setItem(`saldo_${user}`, saldo); // Corrigido
  atualizarSaldo();

  document.getElementById("aviatorStatus").innerText =
    `💰 Sacaste em x${aviatorMultiplicador.toFixed(2)}. Ganho: ${ganho.toFixed(2)} MZN`; // Corrigido
  document.getElementById("aviatorCashout").style.display = "none";
  aviatorAtivo = false;
}