import * as SQLite from 'expo-sqlite';
import { Produto } from './types/Produto';

export const criaBD = async () => {

  const bd = await SQLite.openDatabaseAsync('meubanco');

  bd.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS produtos
    (id INTEGER PRIMARY KEY NOT NULL, nome TEXT NOT NULL, preco REAL NOT NULL);
    INSERT INTO produtos (nome, preco) VALUES ('arroz', 19.30)
    INSERT INTO produtos (nome, preco) VALUES ('kin', 14.30)
    INSERT INTO produtos (nome, preco) VALUES ('feijas', 12.30)
    `);
    
  const primeiroProduto = await bd.getFirstAsync('SELECT * FROM produtos');  

  bd.closeAsync();
}

//GET
export const listarProdutos = async () => {
    const bd = await SQLite.openDatabaseAsync('meubanco');
    const produtos = await bd.getAllAsync<Produto>('SELECT * FROM produtos');
    await bd.closeAsync();
    return produtos;
};

//POST
export const postarProdutos = async (produto: { nome: string, preco: number }) => {
    const bd = await SQLite.openDatabaseAsync('meubanco');
  
    await bd.runAsync(
      `INSERT INTO produtos (nome, preco) VALUES (?, ?)`,
      [produto.nome, produto.preco]
    );
  
    await bd.closeAsync();
  };

// DELETE
export const deleteProduto = async (id: number) => {
    const bd = await SQLite.openDatabaseAsync('meubanco');
  
    const result = await bd.runAsync(
      'DELETE FROM produtos WHERE id = ?',
      [id]
    );
  
    await bd.closeAsync();
  
    if (result.changes === 0) {
      throw new Error('Nenhum produto foi deletado');
    }
};

// UPDATE
export const updateProduto = async (
    id: number,
    produto: { nome: string; preco: number }
  ) => {
    const bd = await SQLite.openDatabaseAsync('meubanco');
  
    const result = await bd.runAsync(
      'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?',
      [produto.nome, produto.preco, id]
    );
  
    await bd.closeAsync();
  
    if (result.changes === 0) {
      throw new Error('Produto não encontrado para atualização');
    }
};

