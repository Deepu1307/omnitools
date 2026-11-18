'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles, 
  FileCode,
  Terminal
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function JsonToTypesPage() {
  const [jsonInput, setJsonInput] = useState<string>(`{
  "id": 101,
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "isActive": true,
  "tags": ["developer", "creator"],
  "stats": {
    "projects": 12,
    "rating": 4.9
  }
}`);

  const [language, setLanguage] = useState<'typescript' | 'pydantic' | 'python_dataclass' | 'go' | 'rust'>('typescript');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const generateTypeScript = (obj: any, rootName = 'Root'): string => {
    let result = '';
    const nestedTypes: string[] = [];

    const processObject = (o: any, name: string): string => {
      let lines = `export interface ${name} {\n`;
      for (const [key, value] of Object.entries(o)) {
        if (value === null) {
          lines += `  ${key}?: any;\n`;
        } else if (Array.isArray(value)) {
          const itemType = value.length > 0 ? typeof value[0] : 'any';
          lines += `  ${key}: ${itemType}[];\n`;
        } else if (typeof value === 'object') {
          const childName = capitalize(key);
          nestedTypes.push(processObject(value, childName));
          lines += `  ${key}: ${childName};\n`;
        } else {
          lines += `  ${key}: ${typeof value};\n`;
        }
      }
      lines += `}\n`;
      return lines;
    };

    const mainInterface = processObject(obj, rootName);
    result = [...nestedTypes, mainInterface].join('\n');
    return result;
  };

  const generatePydantic = (obj: any, rootName = 'RootModel'): string => {
    let result = 'from pydantic import BaseModel\nfrom typing import List, Optional, Any\n\n';
    const models: string[] = [];

    const processObject = (o: any, name: string): string => {
      let lines = `class ${name}(BaseModel):\n`;
      for (const [key, value] of Object.entries(o)) {
        if (value === null) {
          lines += `    ${key}: Optional[Any] = None\n`;
        } else if (Array.isArray(value)) {
          const itemType = value.length > 0 ? (typeof value[0] === 'number' ? 'int' : typeof value[0]) : 'Any';
          lines += `    ${key}: List[${itemType}]\n`;
        } else if (typeof value === 'object') {
          const childName = capitalize(key);
          models.push(processObject(value, childName));
          lines += `    ${key}: ${childName}\n`;
        } else if (typeof value === 'number') {
          lines += `    ${key}: ${Number.isInteger(value) ? 'int' : 'float'}\n`;
        } else if (typeof value === 'boolean') {
          lines += `    ${key}: bool\n`;
        } else {
          lines += `    ${key}: str\n`;
        }
      }
      return lines;
    };

    const main = processObject(obj, rootName);
    result += [...models, main].join('\n');
    return result;
  };

  const generatePythonDataclass = (obj: any, rootName = 'Root'): string => {
    let result = 'from dataclasses import dataclass\nfrom typing import List, Optional, Any\n\n';
    const models: string[] = [];

    const processObject = (o: any, name: string): string => {
      let lines = `@dataclass\nclass ${name}:\n`;
      for (const [key, value] of Object.entries(o)) {
        if (value === null) {
          lines += `    ${key}: Optional[Any] = None\n`;
        } else if (Array.isArray(value)) {
          const itemType = value.length > 0 ? (typeof value[0] === 'number' ? 'int' : typeof value[0]) : 'Any';
          lines += `    ${key}: List[${itemType}]\n`;
        } else if (typeof value === 'object') {
          const childName = capitalize(key);
          models.push(processObject(value, childName));
          lines += `    ${key}: ${childName}\n`;
        } else if (typeof value === 'number') {
          lines += `    ${key}: ${Number.isInteger(value) ? 'int' : 'float'}\n`;
        } else if (typeof value === 'boolean') {
          lines += `    ${key}: bool\n`;
        } else {
          lines += `    ${key}: str\n`;
        }
      }
      return lines;
    };

    const main = processObject(obj, rootName);
    result += [...models, main].join('\n');
    return result;
  };

  const generateGo = (obj: any, rootName = 'Root'): string => {
    const structs: string[] = [];

    const processObject = (o: any, name: string): string => {
      let lines = `type ${name} struct {\n`;
      for (const [key, value] of Object.entries(o)) {
        const fieldName = capitalize(key);
        if (value === null) {
          lines += `\t${fieldName} interface{} \`json:"${key}"\`\n`;
        } else if (Array.isArray(value)) {
          const itemType = value.length > 0 ? (typeof value[0] === 'number' ? 'int' : typeof value[0]) : 'interface{}';
          lines += `\t${fieldName} []${itemType} \`json:"${key}"\`\n`;
        } else if (typeof value === 'object') {
          const childName = capitalize(key);
          structs.push(processObject(value, childName));
          lines += `\t${fieldName} ${childName} \`json:"${key}"\`\n`;
        } else if (typeof value === 'number') {
          lines += `\t${fieldName} ${Number.isInteger(value) ? 'int' : 'float64'} \`json:"${key}"\`\n`;
        } else if (typeof value === 'boolean') {
          lines += `\t${fieldName} bool \`json:"${key}"\`\n`;
        } else {
          lines += `\t${fieldName} string \`json:"${key}"\`\n`;
        }
      }
      lines += `}\n`;
      return lines;
    };

    const main = processObject(obj, rootName);
    return [...structs, main].join('\n');
  };

  const generateRust = (obj: any, rootName = 'Root'): string => {
    const structs: string[] = [];

    const processObject = (o: any, name: string): string => {
      let lines = `#[derive(Debug, Serialize, Deserialize)]\npub struct ${name} {\n`;
      for (const [key, value] of Object.entries(o)) {
        if (value === null) {
          lines += `    pub ${key}: Option<serde_json::Value>,\n`;
        } else if (Array.isArray(value)) {
          const itemType = value.length > 0 ? (typeof value[0] === 'number' ? 'i64' : 'String') : 'serde_json::Value';
          lines += `    pub ${key}: Vec<${itemType}>,\n`;
        } else if (typeof value === 'object') {
          const childName = capitalize(key);
          structs.push(processObject(value, childName));
          lines += `    pub ${key}: ${childName},\n`;
        } else if (typeof value === 'number') {
          lines += `    pub ${key}: ${Number.isInteger(value) ? 'i64' : 'f64'},\n`;
        } else if (typeof value === 'boolean') {
          lines += `    pub ${key}: bool,\n`;
        } else {
          lines += `    pub ${key}: String,\n`;
        }
      }
      lines += `}\n`;
      return lines;
    };

    const main = processObject(obj, rootName);
    return ['use serde::{Deserialize, Serialize};\n', ...structs, main].join('\n');
  };

  let generatedCode = '';
  try {
    const parsed = JSON.parse(jsonInput);
    if (language === 'typescript') generatedCode = generateTypeScript(parsed);
    else if (language === 'pydantic') generatedCode = generatePydantic(parsed);
    else if (language === 'python_dataclass') generatedCode = generatePythonDataclass(parsed);
    else if (language === 'go') generatedCode = generateGo(parsed);
    else if (language === 'rust') generatedCode = generateRust(parsed);
    if (error) setError(null);
  } catch (err: any) {
    generatedCode = '// Invalid JSON input. Please fix syntax to generate types.';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Tools</span>
      </Link>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-3">
          <Terminal className="w-3.5 h-3.5" />
          <span>Developer Utility • Multi-Language Support</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">JSON to Multi-Language Types</h1>
        <p className="text-sm text-slate-500 mt-1">Convert JSON structures into type-safe models for TypeScript, Python Pydantic, Go, and Rust.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Input JSON</span>
            <button
              onClick={() => {
                try {
                  const formatted = JSON.stringify(JSON.parse(jsonInput), null, 2);
                  setJsonInput(formatted);
                } catch (e) {}
              }}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Format JSON
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={18}
            className="w-full flex-1 font-mono text-xs p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
            placeholder="Paste your JSON here..."
          />
        </div>

        {/* Output Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 mb-3 gap-2">
            <div className="flex gap-1">
              {(['typescript', 'pydantic', 'go', 'rust'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                    language === lang
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang === 'typescript' ? 'TypeScript' : lang === 'pydantic' ? 'Pydantic' : lang === 'go' ? 'Go' : 'Rust'}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="flex-1 font-mono text-xs p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-auto leading-relaxed">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>

      <AdBanner slot="in-tool" />
    </div>
  );
}
