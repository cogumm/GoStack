import React, { Component } from "react";

class TechList extends Component {
    state = {
        newTech: "",
        techs: ["NodeJS", "ReactJS", "React Native"]
    };

    handleInputChange = e => {
        this.setState({ newTech: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();

        //console.log(this.state.newTech);
        this.setState({
            techs: [...this.state.techs, this.state.newTech],
            // Fazendo com que o input perca o valor ("limpando" o input)
            newTech: ""
        });
    };

    render() {
        return (
            // Tag sem nome "fragment" <>
            <form onSubmit={this.handleSubmit}>
                <ul>
                    {this.state.techs.map(tech => (
                        <li key={tech}>{tech}</li>
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
