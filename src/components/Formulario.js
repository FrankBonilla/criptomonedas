import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import useMoneda from '../hooks/useMoneda';
import useCriptomoneda from '../hooks/useCriptomoneda';
import axios from 'axios';
import Error from './Error';

const Boton = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    boder: none;
    width: 100%;
    border-radius: 10px;
    color: #FFF;
    transition: background-color .3s ease;

    &:hover {
        background-color: #326AC0;
        cursor:pointer;
    }
    `;

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {

    //state del istado de criptomonedas
    const [ listadocripto, guardarCripto ] = useState([]);
    const [ error, guardarError ] = useState(false);

    const MONEDAS = [
        { codigo: 'USD', nombre: 'Dólar de Estados Unidos'},
        { codigo: 'MXN', nombre: 'Peso Mexicano'},
        { codigo: 'EUR', nombre: 'Euro'},
        { codigo: 'GBP', nombre: 'Libra Esterlina'},
        { codigo: 'CLP', nombre: 'Peso Chileno'},
        { codigo: 'AUD', nombre: 'Dólar Australiano'},
        { codigo: 'NZD', nombre: 'Dólar Neozelandes'}
    ]
    //utilizar useMoneda
    const [ moneda, SelectMonedas ] = useMoneda('Elige tu moneda', '', MONEDAS);

    //utilizar useCriptomoneda

    const [ criptomoneda, SelectCripto ] = useCriptomoneda('Elige tu Criptomoneda','',listadocripto);

    //Ejecutar llamado a la API 
    useEffect(() => {
        const consultarAPI = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

            const resultado = await axios.get(url);
            guardarCripto(resultado.data.Data);
        }
        consultarAPI();
    }, []);

    //cuando el usuario hace submit 
    const cotizadorMoneda = e => {
        e.preventDefault();
        //validar si ambos campos estan llenos 
        if(moneda === '' || criptomoneda === ''){
            guardarError(true);
            return;
        }
        ////pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }

    return(
        <form
            onSubmit={cotizadorMoneda}
            >
            { error ? <Error mensaje="Todos los campos son obligatorios" /> : null }
            <SelectMonedas />
            <SelectCripto />
            <Boton
                type='submit'
                value="Calcular"
                >
            </Boton>
        </form>
    )
}
Formulario.propTypes = {
    guardarMoneda: PropTypes.func.isRequired,
    guardarCriptomoneda: PropTypes.func.isRequired
}

export default Formulario;