import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Produto } from './types/Produto';

import {
  criaBD,
  listarProdutos,
  postarProdutos,
  deleteProduto,
  updateProduto
} from './apiLocal';
import React = require('react');

export default function App() {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoProduto, setPrecoProduto] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await criaBD();
    await carregarProdutos();
  };

  const handleEditar = (produto: Produto) => {
    setNomeProduto(produto.nome);
    setPrecoProduto(produto.preco.toString());
    setEditandoId(produto.id!);
  };

  const carregarProdutos = async () => {
    const dados = await listarProdutos();
    setProdutos(dados);
  };

  const handlepostarProdutos = async () => {
    await postarProdutos({
      nome: nomeProduto,
      preco: Number(precoProduto)
    });

    await carregarProdutos();

    setNomeProduto('');
    setPrecoProduto('');
  };

  const handleSalvar = async () => {
    if (!nomeProduto || !precoProduto) return;
  
    if (editandoId !== null) {
      // UPDATE
      await updateProduto(editandoId, {
        nome: nomeProduto,
        preco: Number(precoProduto)
      });
    } else {
      // INSERT
      await postarProdutos({
        nome: nomeProduto,
        preco: Number(precoProduto)
      });
    }
  
    await carregarProdutos();
  
    // reset
    setNomeProduto('');
    setPrecoProduto('');
    setEditandoId(null);
  };

  const handleDelete = async (id: number) => {
    await deleteProduto(id);
    await carregarProdutos();
  };

  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <TextInput
          style={styles.input}
          value={nomeProduto}
          placeholder="Digite nome"
          onChangeText={setNomeProduto}
        />

        <TextInput
          style={styles.input}
          value={precoProduto}
          placeholder="Digite preço"
          keyboardType="numeric"
          onChangeText={setPrecoProduto}
        />

<TouchableOpacity style={styles.botao} onPress={handleSalvar}>
  <Text style={{ color: 'white' }}>
    {editandoId !== null ? 'Atualizar' : 'Adicionar'}
  </Text>
</TouchableOpacity>

      {produtos.length > 0 &&
        <FlashList
          data={produtos}
          estimatedItemSize={80}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) =>
            <View style={styles.item}>
              <Text>{item.nome} - R${item.preco}</Text>

              <TouchableOpacity
  style={styles.btnEditar}
  onPress={() => handleEditar(item)}
>
  <MaterialIcons name="edit-square" size={22} />
</TouchableOpacity>
              

                <TouchableOpacity
                  style={styles.btnRemover}
                  onPress={() => handleDelete(item.id!)}
                >
                  <MaterialIcons name="highlight-remove" size={22} />
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      }

      {produtos.length === 0 && <Text>Sem produtos cadastrados!</Text>}
    </View>
  );
}