import * as React from "react";
import { addTickListener, removeTickListener } from "./tick";

/**
 * Lifted from Flex monorepo
 */
export class Ticker extends React.Component {
    tick = () => {
        this.forceUpdate();
    };

    componentDidMount() {
        addTickListener(this.tick);
    }

    componentWillUnmount() {
        removeTickListener(this.tick);
    }

    render() {        
        return this.props.children();
    }
}