import Text from './text'
import TextInput from './textInput'

function Widget({ widget_type, ...props }) {
    console.log("widget:", widget_type, props)
    return ({
        'TEXT': <Text {...props} />,
        'TEXT_INPUT': <TextInput {...props} />,
    }[widget_type])
}

export default Widget;