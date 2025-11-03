module.exports = {
  async up(db) {
    const exists = (await db.listCollections({ name: 'customers' }).toArray()).length > 0;
    if (!exists) await db.createCollection('customers');

    await db.collection('customers').createIndex({ document: 1 }, { unique: true });

    await db.collection('customers').createIndex(
      { email: 1 },
      { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
    );

    await db.collection('customers').createIndex({ name: 'text', email: 'text' });

    await db.collection('customers').createIndex({ stage: 1, active: 1 });

    await db.collection('customers').createIndex(
      { 'products.name': 1 },
      { partialFilterExpression: { 'products.active': true } }
    );
  },

  async down(db) {
    // Rollback simples: remove a coleção inteira
    await db.collection('customers').drop();
  }
};
