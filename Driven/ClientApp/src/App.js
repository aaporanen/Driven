import React from 'react';
import { Route } from 'react-router';
import { Base } from './components/Base';
import FolderContent from './components/content/folder/FolderContent';

const App = () => {
    return (
      <Base>
        <Route exact path='/' component={FolderContent} />
      </Base>
    );
}

export default App;