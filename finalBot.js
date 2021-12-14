const env = require('./.env')
const Telegraf = require('telegraf')
const moment = require('moment')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)
const Extra = require('telegraf/extra')
const session = require('telegraf/session')

// iniciando o bot
bot.start(ctx => {
    const from = ctx.update.message.from
    if (from.id != '2083112348' && from.id != '1351450134') {
        console.log(from)
        ctx.reply(`${from.first_name} ${from.last_name}! Não interajo com este ID!!`)
    }
    else {
        ctx.reply('Seja bem vindo!\n'+
        'Utilize os comandos a seguir para as funções:\n'+
        'Para a função Repetir digite /repetir\n'+
        'Para a fução contato apenas envie um contato\n'+
        'Para a fução localicação apenas envie uma localização\n'+
        'Para a fução tempo de aúdio apenas envie aúdio\n'+
        'Para a fução calcular o tamanho da imagem apenas envie uma imagem\n'+
        'Para a fução sticker apenas envie um sticker\n'+
        'Para a função saber dia apenas dígite uma data no formato DD/MM/YYYY\n'+
        'Para a função Animal favorito digite /animais\n'+
        'Para a função adicionar lista ao carrinho /carrinho')
    }
})

bot.command('repetir', ctx => {
    bot.on('text', ctx => {
        const texto = ctx.update.message.text
        ctx.reply(`${texto}`)
        ctx.reply('Dígite /sair para sair do modo repetição')
    })
})


// tratando o evento de recebimento de contato
bot.on('contact', ctx => {
    const cont = ctx.update.message.contact
    console.log(cont)
    ctx.reply(`O usuário: ${cont.first_name} utiliza o número: ${cont.phone_number}`)
})


bot.on('location', ctx => {
    const loc = ctx.update.message.location
    console.log(loc)
    ctx.reply(`Entendido! Você está em: 
        Latitude: ${loc.latitude}, 
        Longitude: ${loc.longitude}`)    
})

bot.on('voice', ctx => {
    const voz = ctx.update.message.voice
    console.log(voz)
    ctx.reply(`Áudio de ${voz.duration} segundos recebido!`)
})

bot.on('photo', ctx => {
    const foto = ctx.update.message.photo
    console.log(foto)
    console.log(foto.length)
    // criando um laço para varrer todas as possíveis fotos enviadas
    foto.forEach((ph, i) => {
        ctx.reply(`A foto ${i} tem resolução de: ${ph.width} X ${ph.height} pixels`)        
    })
})

bot.on('sticker', ctx => {
    const stic = ctx.update.message.sticker
    console.log(stic)
    ctx.reply(`Você enviou o ${stic.emoji} do conjunto ${stic.set_name}`) 
})

bot.hears('ajuda', ctx => {
    ctx.reply('Para ver os comandos disponiveis digite /start')
})

bot.hears('bot', ctx => {
    ctx.reply('Alguma dúvida? ')
})

bot.hears('oi', ctx => {
    ctx.reply('Olá, digite /start para ver os comandos disponiveis')
})

bot.hears('🐷', ctx => {
    ctx.reply('Porco')
})

bot.hears('🐶', ctx => {
    ctx.reply('Cachorro')
})

bot.hears('🐵', ctx => {
    ctx.reply('Macaco')
})


bot.hears(/(\d{2}\/\d{2}\/\d{4})/g, ctx => {
    moment.locale('pt-BR')
    const data = moment(ctx.match[1], 'DD/MM/YYYY')
    ctx.reply(`${ctx.match[1]} cai em ${data.format('dddd')}`)

})


bot.command('animais', ctx => {
    ctx.reply(`Qual animal você prefere?`,
    Markup.keyboard(['🐷 Porco', '🐮 Vaca', '🐮 Carneiro','🐔 Galinha','🐵 Macaco', '🐱 Gato','🐟 Peixe','🐶 Cachorro', '🐁 Rato']).resize().oneTime().extra())
})


bot.command('carrinho', ctx=> {

    let lista = []

        const gerarBotoes = () => Extra.markup (
    Markup.inlineKeyboard(
        lista.map(
            item => Markup.callbackButton(
                item,
                `delete ${item}`
                )
        ),
        { columns: 3}
        )
    )
    const name = ctx.update.message.from.first_name
     ctx.reply('Escreva os itens que deseja adicionar á ao carrinho')

     bot.on('text', ctx  =>{
        lista.push(ctx.update.message.text)
        ctx.reply(`${ctx.update.message.text} adicionado ao carrinho!`,
        gerarBotoes()
        )
    })
    
    bot.action(/delete (.+)/, ctx =>{
        lista = lista.filter(
            item => item !==ctx.match[1])
        ctx.reply(
            `${ctx.match[1]} removido do carrinho`,
            gerarBotoes()
            
        )
    })
    ctx.reply('Dígite /sair para sair do carrinho')
})

bot.command('sair', ctx=> {
   
    const from = ctx.update.message.from
    if (from.id != '2083112348' && from.id != '1351450134' && from.id != '1860624985') {
        console.log(from)
        ctx.reply(`${from.first_name} ${from.last_name}! Não interajo com este ID!!`)
    }
    else {
        ctx.reply(
        'Utilize os comandos a seguir para as funções:\n'+
        'Para a função Repetir digite /repetir\n'+
        'Para a fução contato apenas envie um contato\n'+
        'Para a fução localicação apenas envie uma localização\n'+
        'Para a fução tempo de aúdio apenas envie aúdio\n'+
        'Para a fução calcular o tamanho da imagem apenas envie uma imagem\n'+
        'Para a fução sticker apenas envie um sticker\n'+
        'Para a função saber dia apenas dígite uma data no formato DD/MM/YYYY\n'+
        'Para a função Animal favorito digite /animais\n'+
        'Para a função adicionar lista ao carrinho /carrinho')
    }

})



// iniciando o 'polling' com o servidor para verificar se há novas mensagens na conversa
bot.startPolling()

