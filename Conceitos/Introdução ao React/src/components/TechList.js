import React, { Component } from "react";
import TechItem from "./TechItem";

class TechList extends Component {
    state = {
        newTech: "",
        techs: ["NodeJS", "ReactJS", "React Native"]
    };

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
