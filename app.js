const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
// variables:
let contMesa=0;
let varModo=0;
let varPuntos=0;
let varMonto= 0;
let varJug1 = 0;
let varJug2 = 0;
// $ [  ]

// !aghz modo:1v1 a:15 por:1000 j1:@pepito j2:@manguito
const flowBot = addKeyword('!bot')
    .addAnswer('🤖 *"Ingrese mesa". Ejemplo:* \n m:1v1 a:15 por:1000 j1:@name j2:@name2',
      {capture: true},
      async(ctx,{flowDynamic,globalState})=>{
        console.log('telefono: +', ctx.from, 'uso el bot 🤖')
        contMesa++;
        console.log('contador:',contMesa, 'mesas')
        const text = ctx.body.trim();
        const text2 = ctx.body.trim();
        // busco modo
        const modoMatch = text.match(/M:(\S+) /i);
        const modoMatch2 = text2.match(/m:(\S+) /i);
        if (modoMatch || modoMatch2){
          const modo = modoMatch[1];
          // const modo = parseInt(modoMatch[1], 10);
          // const jugador1 = jug1Match[1];
          await globalState.update({GSmodo: modo})
          varModo= await globalState.getMyState().GSmodo;
          console.log('el modo es',globalState.getMyState().GSmodo)
        }else{
          await globalState.update({GSmodo: ' '})
          console.log('el modo es',globalState.getMyState().GSmodo)
          varModo= await globalState.getMyState().GSmodo;
        }
        // busco puntos
        const puntosMatch = text.match(/a:(\S+) /i);
        if(puntosMatch){
          const puntos = parseInt(puntosMatch[1], 10);
          await globalState.update({GSpuntos: puntos})
          varPuntos= await globalState.getMyState().GSpuntos;
          
        }else{
          await globalState.update({GSpuntos: ' '})
          console.log('puntos a:',globalState.getMyState().GSpuntos)
          varPuntos= await globalState.getMyState().GSpuntos;
        }
        // busco monto
        const montoMatch = text.match(/por:(\d+)/i);
        if (montoMatch) {
         const monto = parseInt(montoMatch[1], 10);
         await globalState.update({GSmonto: monto})
         varMonto= await globalState.getMyState().GSmonto;
         console.log('monto:',globalState.getMyState().GSmonto)
        }else{
          await globalState.update({GSmonto: ' '})
          console.log('monto:',globalState.getMyState().GSmonto)
          varMonto= await globalState.getMyState().GSmonto;
        }
        // busco jug1
        const jug1Match = text.match(/j1:(\S+)/i);
        if(jug1Match){
          const jugador1 = jug1Match[1];
          await globalState.update({GSjugador1: jugador1})
          varJug1= await globalState.getMyState().GSjugador1;
          console.log('jugador 1 es:',globalState.getMyState().GSjugador1)
        }else{
          await globalState.update({GSjugador1: ' '})
          console.log('jugador 1 es:',globalState.getMyState().GSjugador1)
          varJug1= await globalState.getMyState().GSjugador1;
        }
        // busco jug2
        const jug2Match = text.match(/j2:(\S+)/i);
        if(jug2Match){
          const jugador2 = jug2Match[1];
          await globalState.update({GSjugador2: jugador2})
          varJug2= await globalState.getMyState().GSjugador2;
          console.log('jugador 2 es:',globalState.getMyState().GSjugador2)      
        }else{
          await globalState.update({GSjugador2: ' '})
          console.log('jugador 2 es:',globalState.getMyState().GSjugador2)  
          varJug2= await globalState.getMyState().GSjugador2;
        }
        console.log('----------------------')

        await flowDynamic([
          { body: 
            `♠️ *TRUCO KING 5.0* ♠️ ${varModo} a ${varPuntos}
            \n*MESA Nº:* ${contMesa}
            \n*INSCRIPCION:* $ ${varMonto} 
            \n*PREMIO :* $ ${(varMonto*2)*0.95}
            \n1️⃣:${varJug1}
            \n2️⃣:${varJug2}
            \n*IMPORTANTE - SACAR CAPTURA*
            \n*🔥QUIEN SE SUMA🔥*` }
      ]);
    })

    
const flowPrincipal = addKeyword(['hola']) 
    .addAnswer('hola soy el bot', (ctx) =>{
      console.log(ctx);
      console.log('flow principal');
    })


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowBot])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()