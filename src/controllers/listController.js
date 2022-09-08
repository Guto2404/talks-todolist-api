const sha1 = require('sha1');
const errorController = require('./errorController');

module.exports = {
  async getAll(req, res, db) {
    const ownerId = req?.requester?.id;
    const lists = await db('list').where({ user_id: ownerId });
    res.send(lists);
  },

  async get(req, res, db) {
    const ownerId = req?.requester?.id;
    const { id } = req.params;

    const list = await db('list').where({ id, user_id: ownerId }).first();
    if (list) {
      list.items = await db('item').where({ list_id: id });
    }
    res.send(list || 404);
  },

  async create(req, res, db) {
    const ownerId = req?.requester?.id;
    let data = req?.body;
    data.user_id = ownerId;

    await db('list').insert(data);

    res.send(201);
  },

  async update(req, res, db) {
    const ownerId = req?.requester?.id;
    let data = req?.body;
    data.user_id = ownerId;

    await db('list').where({ id: data?.id }).update(data);

    res.send(201);
  },

  async delete(req, res, db) {
    const ownerId = req?.requester?.id;
    const { id } = req.params;

    const isOwner = await db('list').where({ id, user_id: ownerId }).first();

    if (isOwner) {
      await db('item').where({ list_id: id }).del();
      await db('list').where({ id }).del();
      res.send(204);
    } else {
      errorController.Unauthorized(res);
    }


  },

  async addItem(req, res, db) {
    const ownerId = req?.requester?.id;
    let data = req?.body;
    data.user_id = ownerId;
    const { id } = req?.params;

    const list = await db('list').where({ id, user_id: ownerId }).first();

    if (!list) {
      errorController.Unauthorized(res);
    }

    await db('item').insert({ ...data, list_id: id });

    res.send(201);
  },

  async updateItem(req, res, db) {
    const ownerId = req?.requester?.id;
    let data = req?.body;
    data.user_id = ownerId;
    const { id } = req?.params;

    const list = await db('list').where({ id, user_id: ownerId }).first();

    if (!list) {
      errorController.Unauthorized(res);
    }

    await db('item').where({ id: data?.id }).update({ ...data, list_id: id });

    res.send(201);
  },

  async removeItem(req, res, db) {
    const ownerId = req?.requester?.id;
    const { id, item_id } = req?.params;

    const list = await db('list').where({ id, user_id: ownerId }).first();

    if (!list) {
      errorController.Unauthorized(res);
    }

    await db('item').where({ id: item_id }).del();

    res.send(201);
  },


  //DEVER DE CASA

  //Criar cada tora das listas no insomnia baseando-se no modelo de banco em anexo
  //Verifique os campos necessários e execute rota por rota em mais de um usuário.

}