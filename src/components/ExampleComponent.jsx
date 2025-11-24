
/**
 * Example reusable component
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 * @param {string} props.description - Description to display
 */
const ExampleComponent = ({ title, description }) => {
    return (
        <div className="example-component card">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default ExampleComponent;
