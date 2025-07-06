const apiBase = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  carregarUsuarios();

  const form = document.getElementById("user-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const rua = document.getElementById("rua").value;
    const cidade = document.getElementById("cidade").value;

    const novoUsuario = {
      nome,
      email,
      endereco: { rua, cidade }
    };

    try {
      const res = await fetch(`${apiBase}/cadastrar_usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoUsuario)
      });

      if (res.ok) {
        alert("Usuário cadastrado com sucesso!");
        form.reset();
        carregarUsuarios();
      } else {
        const erro = await res.json();
        alert("Erro: " + (erro.erro || "Falha ao cadastrar"));
      }
    } catch (err) {
      alert("Erro de conexão com a API");
      console.log(err)
    }
  });
});

async function carregarUsuarios() {
  const container = document.getElementById("usuarios-container");
  container.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch(`${apiBase}/buscar_usuarios`);
    const usuarios = await res.json();

    if (usuarios.length === 0) {
      container.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
      return;
    }

    container.innerHTML = "";
    usuarios.forEach((usuario) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${usuario.nome}</h3>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Rua:</strong> ${usuario.endereco.rua}</p>
        <p><strong>Cidade:</strong> ${usuario.endereco.cidade}</p>
        <button onclick="deletarUsuario(${usuario.id})">Excluir</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "<p>Erro ao carregar usuários</p>";
  }
}

async function deletarUsuario(id) {
  if (!confirm("Deseja realmente excluir este usuário?")) return;

  try {
    const res = await fetch(`${apiBase}/deletar_usuario/${id}`, {
      method: "DELETE"
    });
    if (res.ok) {
      alert("Usuário deletado com sucesso");
      carregarUsuarios();
    } else {
      alert("Erro ao deletar usuário");
    }
  } catch (err) {
    alert("Erro ao conectar com a API");
  }
}
