import { Knex } from 'knex'

export async function seed(knex: Knex) {
    //await - aguarda concluir para seguir
    await knex('items').insert([
        {
            title: "Papéis",
            image: "papel.png"
        },
        {
            title: "Vidros",
            image: "vidros.png"
        },
        {
            title: "Orgânicos",
            image: "organico.png"
        },
        {
            title: "Latas",
            image: "lata.png"
        },
        {
            title: "Eletrônicos",
            image: "eletronico.png"
        },
        {
            title: "Óleo",
            image: "oleo.png"
        },

    ])
}