import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
}));

const TopNav: React.FC<{}> = props => {
    const classes = useStyles();

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Driven
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

export default TopNav;