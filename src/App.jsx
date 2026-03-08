import { Stack } from '@mui/material'

import Controller from './components/Controller/Controller.jsx'
import Preview from './components/Preview.jsx'

import './App.css'

function App() {

    return (
        <Stack spacing={4} padding={4}>
            <Controller />
            <Preview />
        </Stack>
    )
}

export default App
