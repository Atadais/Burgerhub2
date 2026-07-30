require('dotenv').config();
const db = require('./db');

const menuData = {
  burgers: [
    { id: 'b1', name: 'Бургер в соусе', price: 490, ingredients: 'булочка, говяжья котлета, сыр Чеддер, огурцы маринованные, карамелизированный лук, фри, фирменный соус', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop' },
    { id: 'b2', name: 'Бургер с креветками', price: 440, ingredients: 'булочка 125 мм, креветки, салат, помидоры, сыр Чеддер, соус Спайси', image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=400&fit=crop' },
    { id: 'b3', name: 'Бургер Classic говяжий', price: 420, ingredients: 'булочка 125 мм, говяжья котлета, салат, помидоры, огурцы маринованные, лук красный, сыр Чеддер, соус Гриль', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop' },
    { id: 'b4', name: 'Бургер Classic куриный', price: 380, ingredients: 'булочка 125 мм, куриные стрипсы, салат, помидоры, сыр Чеддер, соус Ранч', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop' },
    { id: 'b5', name: 'Baby бургер говяжий', price: 280, ingredients: 'булочка 100 мм, говяжья котлета, салат, помидоры, огурцы маринованные, лук красный, сыр Чеддер, соус Гриль', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop' },
    { id: 'b6', name: 'Baby бургер куриный', price: 260, ingredients: 'булочка 100 мм, куриные стрипсы, салат, помидоры, сыр Чеддер, соус Ранч', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop' },
    { id: 'b7', name: 'Чизбургер', price: 240, ingredients: 'булочка 100 мм, говяжья котлета, кетчуп, горчица, сыр Чеддер, огурцы маринованные', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop' },
    { id: 'b8', name: 'Гамбургер', price: 220, ingredients: 'булочка 100 мм, говяжья котлета, кетчуп, горчица', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop' }
  ],
  shawarma: [
    { id: 's1', name: 'Шаурма Brisket в кляре', price: 500, ingredients: 'лаваш, мясо Brisket, салат, помидоры, соус барбекю, фирменный соус, кляр', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 's2', name: 'Шаурма Куриная в кляре', price: 440, ingredients: 'лаваш, куриное филе, салат, помидоры, соус фирменный, кляр', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 's3', name: 'Шаурма Brisket', price: 420, ingredients: 'лаваш, мясо Brisket, салат, помидоры, огурцы, соус барбекю, фирменный соус', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 's4', name: 'Шаурма с фаршем', price: 380, ingredients: 'лаваш, говяжий фарш, салат, помидоры, огурцы, соус фирменный', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 's5', name: 'Шаурма фирменная', price: 370, ingredients: 'лаваш, куриное филе, салат, помидоры, огурцы, соус фирменный', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 's6', name: 'Шаурма куриная', price: 340, ingredients: 'лаваш, куриное филе, салат, помидоры, огурцы, соус', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' }
  ],
  tacos: [
    { id: 't1', name: 'Такос с фаршем', price: 400, price2: 450, ingredients: 'пшеничная лепешка, говяжий фарш, сыр, фри, соус', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a14711?w=400&h=400&fit=crop' },
    { id: 't2', name: 'Такос с курицей', price: 400, price2: 450, ingredients: 'пшеничная лепешка, куриное филе, сыр, фри, соус', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a14711?w=400&h=400&fit=crop' }
  ],
  gyro: [
    { id: 'g1', name: 'Гиро фирменный', price: 380, ingredients: 'булочка, куриное филе, фри, салат, свежие помидоры, огурцы маринованные, лук красный, соус', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 'g2', name: 'Гиро классический', price: 360, ingredients: 'булочка, куриное филе, фри, салат, свежие помидоры, свежие огурцы, соус', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' }
  ],
  rolls: [
    { id: 'r1', name: 'Цезарь ролл с креветками', price: 370, ingredients: 'пшеничная лепешка, креветки в панировке, салат, помидоры, огурцы свежие, сыр, соус Цезарь', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 'r2', name: 'Ролл с говядиной', price: 350, ingredients: 'пшеничная лепешка, говяжья котлета, помидоры, огурцы маринованные, лук красный, сыр, соус Ранч', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 'r3', name: 'Ролл фирменный', price: 340, ingredients: 'пшеничная лепешка, куриные стрипсы, салат, помидоры, огурцы маринованные, лук красный, сыр, кетчуп, горчица', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 'r4', name: 'Цезарь ролл с курицей', price: 320, ingredients: 'пшеничная лепешка, куриные стрипсы, салат, помидоры, огурцы свежие, сыр, соус Цезарь', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 'r5', name: 'Кесадилья с курицей', price: 380, ingredients: 'пшеничная лепешка, куриное филе, болгарский перец, помидоры, кукуруза, сыр, соус', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=400&fit=crop' },
    { id: 'r6', name: 'Френч дог', price: 200, ingredients: 'булочка, колбаска Гриль, кетчуп, горчица', image: 'https://images.unsplash.com/photo-1613338439351-c7b7b3ae1d0c?w=400&h=400&fit=crop' }
  ],
  snacks: [
    { id: 'n1', name: 'Острые крылышки 5 шт', price: 349, ingredients: 'Куриные крылышки в остром соусе', image: 'https://images.unsplash.com/photo-1562967916-eb82221d1d2f?w=400&h=400&fit=crop' },
    { id: 'n2', name: 'Стрипсы 3/5 шт', price: 199, price2: 279, ingredients: 'Куриные стрипсы в хрустящей панировке', image: 'https://images.unsplash.com/photo-1562967916-eb82221d1d2f?w=400&h=400&fit=crop' },
    { id: 'n3', name: 'Наггетсы 6/9 шт', price: 189, price2: 229, ingredients: 'Куриные наггетсы в хрустящей панировке', image: 'https://images.unsplash.com/photo-1562967916-eb82221d1d2f?w=400&h=400&fit=crop' },
    { id: 'n4', name: 'Сырные шарики 8 шт', price: 249, ingredients: 'Сырные шарики в панировке', image: 'https://images.unsplash.com/photo-1562967916-eb82221d1d2f?w=400&h=400&fit=crop' },
    { id: 'n5', name: 'Картошка по-деревенски', price: 199, ingredients: 'Картофель с кожурой, соль, специи', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop' },
    { id: 'n6', name: 'Картофель фри', price: 189, ingredients: 'Картофель, соль, специи', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop' }
  ],
  salads: [
    { id: 'l1', name: 'Салат цезарь с курицей', price: 350, ingredients: 'Куриное филе, салат романо, помидоры, сыр пармезан, соус Цезарь, сухарики', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop' },
    { id: 'l2', name: 'Салат цезарь с креветками', price: 380, ingredients: 'Креветки, салат романо, помидоры, сыр пармезан, соус Цезарь, сухарики', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=400&fit=crop' }
  ],
  drinks: [
    { id: 'd1', name: 'Бабугент', price: 60, price2: 60, ingredients: 'Газированный и негазированный напиток, 0.5 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd2', name: 'Палпи', price: 100, ingredients: 'Сок, 0.5 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd3', name: 'Lit Energy', price: 120, ingredients: 'Энергетический напиток, 0.45 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd4', name: 'Flash', price: 100, ingredients: 'Энергетический напиток, 0.45 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd5', name: 'Adrenaline', price: 150, ingredients: 'Энергетический напиток, 0.5 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd6', name: 'Кинза', price: 120, ingredients: 'Лимонад, 0.5 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd7', name: 'Добрый кола (ж/б)', price: 100, ingredients: 'Кола в жестяной банке, 0.33 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd8', name: 'Добрый кола 1 л', price: 120, ingredients: 'Кола, 1 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd9', name: 'Сок 1 л', price: 120, ingredients: 'Сок, 1 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd10', name: 'Груша (стекло)', price: 80, ingredients: 'Грушевый напиток в стекле, 0.5 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd11', name: 'Чай', price: 50, ingredients: 'Чай чёрный, 0.3 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' },
    { id: 'd12', name: 'Кофе', price: 50, ingredients: 'Кофе чёрный, 0.2 л', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=400&fit=crop' }
  ],
  sauces: [
    { id: 'sau1', name: 'Сырный', price: 50, ingredients: 'Сырный соус', image: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=400&fit=crop' },
    { id: 'sau2', name: 'Кетчуп', price: 50, ingredients: 'Томатный кетчуп', image: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=400&fit=crop' },
    { id: 'sau3', name: 'Горчичный', price: 50, ingredients: 'Горчичный соус', image: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=400&fit=crop' },
    { id: 'sau4', name: 'Барбекю', price: 50, ingredients: 'Соус барбекю', image: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=400&fit=crop' },
    { id: 'sau5', name: 'Чили', price: 50, ingredients: 'Острый соус чили', image: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=400&fit=crop' },
    { id: 'sau6', name: 'Фирменный зелёный', price: 50, ingredients: 'Зелёный соус (петрушка, чеснок, масло)', image: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=400&fit=crop' },
    { id: 'sau7', name: 'Фирменный красный', price: 50, ingredients: 'Красный соус (томаты, перец, специи)', image: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&h=400&fit=crop' }
  ]
};

async function run() {
  try {
    await db.initDB();
    await db.seedMenu(menuData);
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

run();