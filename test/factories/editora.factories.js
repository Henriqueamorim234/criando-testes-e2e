import conexao from '#db/singleton-connection.js';

export async function criarEditora(dadosParciais = {}) {
  const [editora] = await conexao('editoras')
    .insert({
      nome: 'Editora Teste',
      email: 'editora@taste.com',
      cidade: 'Cidade Teste',
      ...dadosParciais,
    })
    .returning('*');

  return editora;
}
