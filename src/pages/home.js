import { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import BlastDbPreview from '../components/blastdb-preview';
import Wrapper from '../components/wrapper';
import { urlRoot } from '../url';

function Home() {

  let [data, setData] = useState([])

  useEffect(() => {
    fetch(`${urlRoot}/blastdbs/`)
    .then((response) => response.json())
    .then((data) => {
      setData(data)
    } )
    .catch((e) => console.log(e))
  }, [])

  return (
    <Wrapper>
      <div>
        <h2>Databases available</h2>
        <p>Found {data.length} blast database(s) to run.</p>
      </div>
      <ListGroup>
        {data.map(db => <BlastDbPreview database={db}></BlastDbPreview>)}
      </ListGroup>
    </Wrapper>
  );
}

export default Home;
