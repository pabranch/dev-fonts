import { Helmet } from 'react-helmet';
import React, { useState } from 'react';
import {
  Select, Checkbox, AutoComplete, Badge, Switch, Row, Col, Typography,
} from 'antd';
import Layout from '../components/layout';
import { languages } from '../data/languages';
import { fonts } from '../data/fonts';
import { themes } from '../data/themes';
import { code as codeSample } from '../data/code';
import './index.scss';
import { FontPreview } from '../components/FontPreview';

const { Option } = Select;
const { Title } = Typography;

export default () => {
  const [code, setCode] = useState(codeSample);
  const [isCompareMode, setCompareMode] = useState(false);
  const [compareSet, setCompareSet] = useState(new Set<string>());

  const toggleCompare = (fontName) => {
    if (compareSet.has(fontName)) {
      compareSet.delete(fontName);
    } else {
      compareSet.add(fontName);
    }
    setCompareSet(new Set([...compareSet]));
  };

  const [theme, setTheme] = useState('material-palenight');
  const onThemeChange = (value) => {
    setTheme(value);
  };

  const [language, setLanguage] = useState('JavaScript');
  const onLanguageChange = (value) => {
    setLanguage(value);
  };

  const [filters, setFilters] = useState({ free: false, ligatures: false, name: '' });

  const mode = languages.find((l) => l.name === language)?.mode!;

  const filteredFonts = fonts.filter((font) => {
    if (isCompareMode && !compareSet.has(font.displayName)) {
      return false;
    }

    if (filters.free && font.price) {
      return false;
    }

    if (filters.ligatures && !font.ligatures) {
      return false;
    }

    if (filters.name && !font.displayName.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <>
      <Helmet
        title="Dev Fonts"
        meta={[
          { name: 'description', content: 'A list of fonts for developers' },
          { name: 'keywords', content: 'coding, developer, font, javascript, vscode' },
        ]}
      >
        <script
          src={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/mode/${mode}/${mode}.min.js`}
          onLoad='document.dispatchEvent(new CustomEvent("mode-loaded"))'
        />

        <link
          rel="stylesheet"
          href={`https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/theme/${theme}.css`}
        />
      </Helmet>
      <Layout>
        <Title level={2} style={{ fontFamily: 'Courier New, monospace'}}>
          Dev Fonts
        </Title>
        <Row>
          <Col span={24} md={12} className="row-spacer">
            <Row>
              <Col span={6}>
                <label htmlFor="theme-selector">Theme</label>
              </Col>
              <Col>
                <Select
                  id="theme-selector"
                  showSearch
                  style={{ width: 200 }}
                  value={theme}
                  onChange={onThemeChange}
                >
                  {themes.map(({ name }) => (
                    <Option key={name} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
          <Col span={24} md={12} className="row-spacer">
            <Row>
              <Col span={6}>
                <label htmlFor="language-selector">Language</label>
              </Col>
              <Col>
                <Select
                  id="language-selector"
                  showSearch
                  style={{ width: 150 }}
                  value={language}
                  onChange={onLanguageChange}
                >
                  {languages.map(({ name }) => (
                    <Option key={name} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="filter-wrapper row-spacer">
          <Col span={9} md={5}>
            <label>
              Filter fonts
            </label>
            <Badge count={filteredFonts.length} style={{ backgroundColor: '#52c41a' }} />
          </Col>
          <Col span={14} md={8}>
            <AutoComplete
              className="autocomplete"
              style={{ width: '100%', maxWidth: 200 }}
              options={fonts.map(({ displayName }) => ({ value: displayName }))}
              placeholder="type font name"
              filterOption={(inputValue, option) => option.value.toLowerCase().includes(inputValue.toLowerCase())}
              onSelect={(value, option) => { setFilters((current) => ({ ...current, name: value })); }}
              onChange={(value) => { if (!value) { setFilters((current) => ({ ...current, name: value })); } }}
            />
          </Col>

          <Col span={9} md={1} />
          <Col>
            <Checkbox
              checked={filters.free}
              onChange={(e) => { setFilters((current) => ({ ...current, free: e.target.checked })); }}
            >
              Free
            </Checkbox>
            <Checkbox
              checked={filters.ligatures}
              onChange={(e) => { setFilters((current) => ({ ...current, ligatures: e.target.checked })); }}
            >
              Ligatures
            </Checkbox>
          </Col>
        </Row>

        <Row className="compare-wrapper">
          Compare
          {' '}
          <Switch className="compare-switch" checked={isCompareMode} onChange={(value) => { setCompareMode(value); }} />
          {' '}
          { compareSet.size > 0 ? [...compareSet].join(', ') : 'add fonts to compare'}
        </Row>
        <style>
          {`
            .codemirror-container {
              height: auto;
            }

            .CodeMirror {
              height: auto;
              font-variant-ligatures: contextual;
              padding-top: 6px;
              padding-bottom: 6px;
              border-radius: 6px;
            }
          `}
        </style>
        <div>
          {filteredFonts.map((font) => (
            <FontPreview
              key={font.familyName}
              font={font}
              theme={theme}
              mode={mode}
              code={code}
              setCode={setCode}
              toggleCompare={toggleCompare}
              isInCompare={compareSet.has(font.displayName)}
            />
          ))}
        </div>
      </Layout>
    </>
  );
};
