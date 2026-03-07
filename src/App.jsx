import { Stack } from '@mui/material'

import AddPanel from './components/AddPanel.jsx'
import Preview from './components/Preview.jsx'

import './App.css'

function App() {

    return (
        <Stack spacing={4} padding={4}>
            <AddPanel />
            <Preview />
        </Stack>
    )
}

export default App
