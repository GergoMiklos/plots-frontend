import React, {useEffect, useState} from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Widget from '../widgets/widget'

const WIDGET_STATES = 'WIDGET_STATES'

const client = new W3CWebSocket('ws://localhost:8888/ws/nb_script');

function Page() {
    const [widgetStates, updateWidgetStates] = useState([])
    console.log('widgetStates', widgetStates)


    let widget_state_updates = []
    let lastSendUpdateId
    const send_widget_update = state_update => {
        clearTimeout(lastSendUpdateId)
        widget_state_updates.push(state_update)
        lastSendUpdateId = setTimeout(() => {
            client?.send(JSON.stringify({
                message_type: 'WIDGET_STATE_UPDATE',
                data: widget_state_updates
            }))
            widget_state_updates = []
        }, 1000)
    }


    const createOnWidgetChangeCallback = widget_key => ({ value }) => {
        console.log('change')
        updateWidgetStates(widgetStates.map(widget_state => {
            if(widget_state.widget_key === widget_key) {
                widget_state.widget.value = value
            }
            return widget_state
        }))
        send_widget_update({ widget_key, value })
    }

    const merge_sort_widget_states = (left, right) => {
        const predicate = (l, r) => {
            if (l.cell_index < r.cell_index) {
                return true
            }
            if (l.cell_index === r.cell_index) {
                if (l.widget_index < r.widget_index) {
                    return true
                }
            }
            return false
        }

        let arr = []
        while (left.length && right.length) {
            if(left[0].widget_key === right[0].widget_key) {
                arr.push({...left.shift(), ...right.shift()})
            } else if (predicate(left[0], right[0])) {
                arr.push(left.shift())
            } else {
                arr.push(right.shift())
            }
        }
        console.log('left', left)
        console.log('left', right)
        return [ ...arr, ...left, ...right ]
    }

    client.onmessage = (message) => {
        const input = JSON.parse(message.data)
        console.log('message', message.data)
        if(input.message_type === WIDGET_STATES) {
            // todo update/add/sort
            updateWidgetStates(merge_sort_widget_states(widgetStates, input.data));
        }
    };

    console.log("rerender", widgetStates)
    return (
        <div className="bg-neutral-100 h-full p-3">
            {
                Object.values(widgetStates).map(({ widget_type, widget_key, widget }) => // todo: sort
                    (<Widget
                        {...widget}
                        widget_type={widget_type}
                        onChange={createOnWidgetChangeCallback(widget_key)}
                        key={widget_key}/>)
                )
            }
        </div>
    );
}

export default Page;