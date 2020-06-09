import React, { Component } from "react";
import TechItem from "./TechItem";

class TechList extends Component {
    state = {
        newTech: "",
        techs: []
    };

    // Ciclo de vida
    // Executado assim que o componente aparece na tela
    componentDidMount() {
        const techs = localStorage.getItem("techs");

        if (techs) {
            this.setState({ techs: JSON.parse(techs) });
        }
    }

    // Executado sempre que houver alterações nas props ou estado
    componentDidUpdate(_, prevState) {
        // prevProps
        //this.props, this.state
        if (prevState.techs !== this.state.techs) {
            localStorage.setItem("techs", JSON.stringify(this.state.techs));
        }
    }

    // Executado quando o componente deixa de existir
    // Utilizado quando tiver que ficar ouvindo 'listen' algum evento
    componentWillMount() {}

    handleInputChange = e => {
        this.setState({ newTech: e.target.value });
    };

    // Função de "adicionar"
    handleSubmit = e => {
        e.preventDefault();

        //console.log(this.state.newTech);
        this.setState({
            techs: [...this.state.techs, this.state.newTech],
            // Fazendo com que o input perca o valor ("limpando" o input)
            newTech: ""
        });
    };

    // Função de delete
    handleDelete = tech => {
        //console.log(tech);
        this.setState({ techs: this.state.techs.filter(t => t !== tech) });
    };

    render() {
        return (
            // Tag sem nome "fragment" <>
            <form onSubmit={this.handleSubmit}>
                <ul>
                    {this.state.techs.map(tech => (
                        <TechItem
                            key={tech}
                            tech={tech}
                            onDelete={() => this.handleDelete(tech)}
                        />
                    ))}
                </ul>
                <input
                    type="text"
                    onChange={this.handleInputChange}
                    value={this.state.newTech}
                />
                <button type="submit">Enviar</button>
            </form>
        );
    }
}

export default TechList;
