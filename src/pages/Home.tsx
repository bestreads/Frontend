import { useState } from 'react';
import { Button } from '../components/ui/button';

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Shadcn Component Test</h1>
      <p>Teste verschiedene Button-Varianten:</p>

      <div>
        <h2>Button Variants</h2>
        <Button>Default Button</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div>
        <h2>Button Sizes</h2>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>

      <div>
        <h2>Interactive Counter</h2>
        <p>Count: {count}</p>
        <Button onClick={() => setCount(count - 1)}>-</Button>
        <Button onClick={() => setCount(0)} variant="outline">Reset</Button>
        <Button onClick={() => setCount(count + 1)}>+</Button>
      </div>

      <div>
        <h2>Disabled State</h2>
        <Button disabled>Disabled Button</Button>
      </div>
    </div>
  );
};

export default Home;
