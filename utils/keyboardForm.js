function keyboardAfterAddApp(keyboard, {id, store}){
    if(keyboard.length === 1){
        return [
                    [{
                        text: "Remove app",
                        callback_data:JSON.stringify([
                            id,
                            'remove',
                            store
                        ])
                    }],
                    [{
                        text: "Show more info and actions",
                        callback_data: JSON.stringify([
                            id,
                            'info',
                            store
                        ]) 
                    }]
                ]
    }else {
        keyboard[0]= [{
            text: "Show more info and actions",
            callback_data: JSON.stringify([
                id,
                'info',
                store,
            ]) 
        }],
        keyboard.unshift(
            [{
                text: "Remove app",
                callback_data: JSON.stringify([
                    id,
                    'remove',
                    store
                ])
            }])
        return keyboard
    }

}


function keyboardAfterRemove(keyboard, { id, store }){
    if(keyboard.length === 2){
        keyboard.pop()
        keyboard[0] = [{
            text: 'Add app',
            callback_data:JSON.stringify([
                id,
                'add',
                store
            ])
        }]
        return keyboard
    }else {
        return [
            [{
                text: 'Add app',
                callback_data:JSON.stringify([
                    id,
                    'add',
                    store
                ])
            }],
            keyboard[2] // next
        ]
    }

}

function keyboardAfterSubscribe(keyboard, { id, store }){
    keyboard[keyboard.length-1] = [{
        text: "Unsubscribe",
        callback_data: JSON.stringify([
            id,
            'sub',
            store
        ])
    }]
    return keyboard
}

function keyboardAfterUnsubscribe(keyboard, { id, store }){
    keyboard[keyboard.length-1] = [{
        text: "Subscribe",
        callback_data: JSON.stringify([
            id,
            'sub',
            store
        ])
    }]
    return keyboard
}

async function keyboardAfterNextReviews(ctx){
    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard
    keyboard.pop()
    await ctx.telegram.editMessageText(
        ctx.chat.id, 
        ctx.update.callback_query.message.message_id,
        null,
        ctx.update.callback_query.message.text,
        { 
            "description": ctx.update.callback_query.message.caption,
            'parse_mode': 'html',
            "reply_markup": {"inline_keyboard" : keyboard}})
}

function changeKeyboard(ctx, data, callback) {
    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard
    let newKeyboard = callback(keyboard, { id: data[0], store: data[2]} )
    ctx.telegram.editMessageCaption(
        ctx.chat.id, 
        ctx.update.callback_query.message.message_id,
        null,
        ctx.update.callback_query.message.caption,
        { 
            "description": ctx.update.callback_query.message.caption,
            'parse_mode': 'html',
            "reply_markup": {"inline_keyboard" : newKeyboard}})
}

function keyboardAfterSelect(plan){
    return {
        "reply_markup": {
            "one_time_keyboard": false,
            "resize_keyboard": true,
            "inline_keyboard": [
                [{
                    text: "Pay",
                    callback_data: JSON.stringify({
                        plan: plan,
                        state: "pay"
                    })
                }]
            ]
        }
    };
}

async function keyboardAfterNext(ctx){
    const keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard
    keyboard.pop()
    await ctx.telegram.editMessageCaption(
        ctx.chat.id, 
        ctx.update.callback_query.message.message_id,
        null,
        ctx.update.callback_query.message.caption,
        { 
            "description": ctx.update.callback_query.message.caption,
            'parse_mode': 'html',
            "reply_markup": {"inline_keyboard" : keyboard}})
    return keyboard
}

module.exports = {
    keyboardAfterAddApp,
    keyboardAfterRemove,
    keyboardAfterSubscribe,
    keyboardAfterUnsubscribe,
    changeKeyboard,
    keyboardAfterNextReviews,
    keyboardAfterSelect,
    keyboardAfterNext
}