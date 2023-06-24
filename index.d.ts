export default class Component {
    constructor(props: any);
    state: {
        level: number;
        text: string;
        screen: number;
        panelHeight: number;
    };
    componentDidMount: () => void;
    componentDidUpdate(): void;
    closePanel: () => void;
    render(): any;
}
