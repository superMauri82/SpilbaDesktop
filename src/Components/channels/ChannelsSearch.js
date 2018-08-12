import React from 'react';
import PropTypes from 'prop-types';

class LogSearch extends React.Component {

    handleSearch = (term) => {
        const logs = this.props.logs.filter((log) => {
            let result = true;
            if(result) result = (log.data.tags.filter((tag)=> tag.search(term) !== -1 ).length > 0);
            return result;
        })
        this.props.onSearch(logs);
    }

    render() {
        return (
            <div>
                <label> Search
                    <input type="text" onChange={ (event) => this.handleSearch(event.target.value)}/>
                </label>
            </div>
        )
    }
};

LogSearch.propTypes = {
    logs: PropTypes.arrayOf(PropTypes.object),
    onSearch: PropTypes.func
}

export default LogSearch;