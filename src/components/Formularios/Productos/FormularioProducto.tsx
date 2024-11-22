import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';

// Create a client
const queryClient = new QueryClient();

// Tipos
type Producto = {
  nombreGenerico: string;
  nombreComercial: string;
  descripcion: string;
  unidadMedida: string;
  presentacion: string;
  composicion: string;
  referencia: string;
  uso: string;
  metodoEsterilizar: string;
  marca: string;
  categoria: string;
  registroSanitario: string;
  estado: boolean;
  proveedores: string[];
};

type Option = {
  value: string;
  label: string;
};

// Componentes
const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  isTextarea?: boolean;
}> = ({ label, name, value, onChange, placeholder, isTextarea = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-[#00632C] mb-1">{label}</label>
    {isTextarea ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
      />
    ) : (
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
      />
    )}
  </div>
);

const SelectField: React.FC<{
  label: string;
  name: string;
  options: Option[];
  onChange: (option: any) => void;
  placeholder: string;
  isMulti?: boolean;
}> = ({ label, name, options, onChange, placeholder, isMulti = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-[#00632C] mb-1">{label}</label>
    <Select
      options={options}
      placeholder={placeholder}
      styles={customSelectStyles}
      onChange={onChange}
      isMulti={isMulti}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  </div>
);

const ImageDropzone: React.FC<{
  onDrop: (acceptedFiles: File[]) => void;
  imagenes: File[];
}> = ({ onDrop, imagenes }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: true
  });

  return (
    <div>
      <label className="block text-sm font-medium text-[#00632C] mb-1">Imágenes del Producto</label>
      <div {...getRootProps()} className={`p-6 mt-1 border-2 border-dashed rounded-md ${isDragActive ? 'border-[#00873D] bg-[#e6f4ea]' : 'border-[#80C68C]'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-center text-[#00632C]">Suelta las imágenes aquí...</p>
        ) : (
          <p className="text-center text-[#00632C]">Arrastra y suelta imágenes aquí, o haz clic para seleccionar archivos</p>
        )}
      </div>
      {imagenes.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-[#00632C] mb-2">Imágenes seleccionadas:</p>
          <ul className="list-disc pl-5">
            {imagenes.map((file, index) => (
              <li key={index} className="text-sm text-[#333333]">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-[#00873D]' : 'bg-gray-600'}`}></div>
      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${checked ? 'transform translate-x-6' : ''}`}></div>
    </div>
    <div className="ml-3 text-sm font-medium text-[#00632C]">
      {label}
    </div>
  </label>
);

// Estilos para los selects
const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    borderColor: '#80C68C',
    '&:hover': {
      borderColor: '#00873D'
    }
  }),
  option: (provided: any, state: { isSelected: any; }) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#00873D' : 'white',
    color: state.isSelected ? 'white' : '#333333',
    '&:hover': {
      backgroundColor: '#00632C',
      color: 'white'
    }
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#80C68C',
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: '#333333',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: '#333333',
    '&:hover': {
      backgroundColor: '#00632C',
      color: 'white',
    },
  }),
};

// Funciones para obtener datos de la API
const fetchMarcas = async (): Promise<Option[]> => {
  const response = await fetch('/api/marcas');
  if (!response.ok) {
    throw new Error('Error al obtener las marcas');
  }
  return response.json();
};

const fetchCategorias = async (): Promise<Option[]> => {
  const response = await fetch('/api/categorias');
  if (!response.ok) {
    throw new Error('Error al obtener las categorías');
  }
  return response.json();
};

const fetchRegistrosSanitarios = async (): Promise<Option[]> => {
  const response = await fetch('/api/registros-sanitarios');
  if (!response.ok) {
    throw new Error('Error al obtener los registros sanitarios');
  }
  return response.json();
};

const fetchProveedores = async (): Promise<Option[]> => {
  const response = await fetch('/api/proveedores');
  if (!response.ok) {
    throw new Error('Error al obtener los proveedores');
  }
  return response.json();
};

// Componente principal
const FormularioProductoInterno: React.FC = () => {
  const [producto, setProducto] = useState<Producto>({
    nombreGenerico: '',
    nombreComercial: '',
    descripcion: '',
    unidadMedida: '',
    presentacion: '',
    composicion: '',
    referencia: '',
    uso: '',
    metodoEsterilizar: '',
    marca: '',
    categoria: '',
    registroSanitario: '',
    estado: true,
    proveedores: []
  });

  const [imagenes, setImagenes] = useState<File[]>([]);
  const [fichasTecnicas, setFichasTecnicas] = useState<File[]>([]);

  const { data: marcas = [] } = useQuery('marcas', fetchMarcas);
  const { data: categorias = [] } = useQuery('categorias', fetchCategorias);
  const { data: registrosSanitarios = [] } = useQuery('registrosSanitarios', fetchRegistrosSanitarios);
  const { data: proveedores = [] } = useQuery('proveedores', fetchProveedores);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (option: any) => {
    setProducto(prev => ({ ...prev, [name]: option.value }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImagenes(prevImagenes => [...prevImagenes, ...acceptedFiles]);
  }, []);

  const handleFichasTecnicas = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFichasTecnicas([...fichasTecnicas, ...Array.from(e.target.files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(producto).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    imagenes.forEach((imagen, index) => {
      formData.append(`imagen_${index}`, imagen);
    });

    fichasTecnicas.forEach((ficha, index) => {
      formData.append(`ficha_tecnica_${index}`, ficha);
    });

    console.log('Formulario listo para enviar:', formData);

    // Aquí iría la lógica para enviar formData al servidor
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] text-[#333333] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-[#00632C]">Crear Nuevo Producto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Nombre Genérico"
              name="nombreGenerico"
              value={producto.nombreGenerico}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre genérico"
            />
            <InputField
              label="Nombre Comercial"
              name="nombreComercial"
              value={producto.nombreComercial}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre comercial"
            />
          </div>

          <InputField
            label="Descripción"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleInputChange}
            placeholder="Ingrese la descripción del producto"
            isTextarea
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Unidad de Medida"
              name="unidadMedida"
              value={producto.unidadMedida}
              onChange={handleInputChange}
              placeholder="Ej: kg, litros, unidades"
            />
            <InputField
              label="Presentación"
              name="presentacion"
              value={producto.presentacion}
              onChange={handleInputChange}
              placeholder="Ej: Caja de 10 unidades"
            />
          </div>

          <InputField
            label="Composición"
            name="composicion"
            value={producto.composicion}
            onChange={handleInputChange}
            placeholder="Ingrese la composición del producto"
            isTextarea
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Referencia del Producto"
              name="referencia"
              value={producto.referencia}
              onChange={handleInputChange}
              placeholder="Ingrese la referencia"
            />
            <InputField
              label="Uso"
              name="uso"
              value={producto.uso}
              onChange={handleInputChange}
              placeholder="Ingrese el uso del producto"
            />
          </div>

          <InputField
            label="Método de Esterilizar"
            name="metodoEsterilizar"
            value={producto.metodoEsterilizar}
            onChange={handleInputChange}
            placeholder="Ingrese el método de esterilización"
          />

          <ImageDropzone onDrop={onDrop} imagenes={imagenes} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Marca"
              name="marca"
              options={marcas}
              onChange={handleSelectChange('marca')}
              placeholder="Seleccione una marca"
            />
            <SelectField
              label="Categoría"
              name="categoria"
              options={categorias}
              onChange={handleSelectChange('categoria')}
              placeholder="Seleccione una categoría"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fichasTecnicas" className="block text-sm font-medium text-[#00632C] mb-1">Fichas Técnicas</label>
              <input
                type="file"
                id="fichasTecnicas"
                multiple
                onChange={handleFichasTecnicas}
                className="w-full p-2 border border-[#80C68C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00873D]"
              />
            </div>
            <SelectField
              label="Registro Sanitario"
              name="registroSanitario"
              options={registrosSanitarios}
              onChange={handleSelectChange('registroSanitario')}
              placeholder="Seleccione un registro sanitario"
            />
          </div>

          <SelectField
            label="Proveedores"
            name="proveedor"
            options={proveedores}
            onChange={(selectedOptions) => setProducto(prev => ({ ...prev, proveedores: selectedOptions.map((option: Option) => option.value) }))}
            placeholder="Seleccione uno o más proveedores"
            isMulti
          />

          <Switch
            checked={producto.estado}
            onChange={(checked) => setProducto(prev => ({ ...prev, estado: checked }))}
            label={`Estado (${producto.estado ? 'Activo' : 'Inactivo'})`}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#FFD700] text-[#333333] rounded-full hover:bg-[#00632C] hover:text-white transition-colors duration-200"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrap the component with QueryClientProvider
const FormularioProducto: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <FormularioProductoInterno />
  </QueryClientProvider>
);

export default FormularioProducto;