/**
 * Aluno.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
      nome: {
        type: 'string',  
      }, 
      cpf: {
        type: 'string',  
      },
      mensalidade: {
        type: 'float'
      },
      materia: {
        collection: 'materias',
        via: 'alunos'
      }
  }
};

