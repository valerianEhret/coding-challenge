import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { Product } from "../../types/Product";
import styles from "./index.module.css";
import { ChangeEvent, useState } from "react";
import SelectField from "../../components/SelectField";
import Button from "../../components/Button";
import { useRouter } from "next/router";
import Link from "next/link"


const ProductDetails: React.FC<{ product: Product }> = (props) => {





  const route = useRouter()
  console.log(route.query.id)



  const [formatValue, setFormatValue] = useState(props.product.defaultSelectedProductOptions.format)
  const [paperValue, setPaperValue] = useState(props.product.defaultSelectedProductOptions.paper)
  const [refinementValue, setRefinementValue] = useState(props.product.defaultSelectedProductOptions.refinement)
  const [quantityValue, setQuantityValue] = useState(props.product.defaultSelectedProductOptions.quantity)


  const filteredVariant = props.product.variants.find(variant => variant.format === formatValue)
  const photoAddress = filteredVariant.image

  const quantityPrice = filteredVariant.prices.find(price => price.quantity === quantityValue).price
  const paperAdditionalPrice = filteredVariant.productOptions.papers.find(paper => paper.key === paperValue).price
  const refinementAdditionalPrice = filteredVariant.productOptions.refinements.find(refinement => refinement.key === refinementValue).price

  const onChangeCallback = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormatValue(e.currentTarget.value)
  }
  const onChangeCallback2 = (e: ChangeEvent<HTMLSelectElement>) => {
    setPaperValue(e.currentTarget.value)
  }
  const onChangeCallback3 = (e: ChangeEvent<HTMLSelectElement>) => {
    setRefinementValue(e.currentTarget.value)
  }
  const onChangeCallback4 = (e: ChangeEvent<HTMLSelectElement>) => {
    setQuantityValue(+e.currentTarget.value)
  }

  const priceTransform = (num: number) => {
    return (num / 100).toFixed(2).toString().replace('.', ',');
  }


  return (



    <div className={styles.container}>
      <Head>
        <title>{props.product.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.image}>
          <img src={photoAddress} alt="Geburtskarte Pure Happiness" />
        </div>

        <section className={styles.description}>
          <div className={styles.nameHolder}>
            <span className={styles.text1}>{props.product.groupName}</span>
            <h1 >
              <span className={styles.text2}>{props.product.name}</span>
            </h1>
            <span className={styles.price}>{priceTransform((quantityPrice + paperAdditionalPrice + refinementAdditionalPrice) * quantityValue) + '€'}</span>
          </div>

          <div className={styles.productOptions}>
            <SelectField label={'Format'} id={'format'} onChange={onChangeCallback} value={formatValue}>
              {props.product.variants.map(variant => <option key={variant.format} value={variant.format}>{variant.formatLabel}</option>)}
            </SelectField>
            <SelectField label={'Papier'} id={'papier'} onChange={onChangeCallback2} value={paperValue}>
              {filteredVariant.productOptions.papers.map(paper => <option disabled={refinementValue === 'V02' && !paper.isRefinable} key={paper.key} value={paper.key}>{paper.label + (paper.price ? '+ ' + ((paper.price) / 100).toFixed(2).toString().replace('.', ',') + '€' : '')}</option>)}
            </SelectField>
            <SelectField label={'Veredelung'} id={'veredelung'} onChange={onChangeCallback3} value={refinementValue}>
              {filteredVariant.productOptions.refinements.map(refinement => <option disabled={paperValue === 'P14' && refinement.key === 'V02'} key={refinement.key} value={refinement.key}>{refinement.label + (refinement.price ? '+ ' + ((refinement.price) / 100).toFixed(2).toString().replace('.', ',') + '€' : '')}</option>)}
            </SelectField>
            <SelectField label={'Menge'} id={'menge'} onChange={onChangeCallback4} value={quantityValue}>
              {filteredVariant.prices.map(price => <option key={price.label} value={price.quantity}>{`${price.quantity} (à ${priceTransform(price.price)})€`}</option>)}
            </SelectField>






          </div>
          <div className={styles.btn}>
            {/*<Button  onClick={()=>(window.location.href = `/configure?format=${formatValue}&refinement=${refinementValue}&paper=${paperValue}&quantity=${quantityValue}&id=${route.query.id}`)} >Jetzt gestalten</Button>*/}
            <Button id='link' onClick={() => (window.location.href = `/configure?format=${formatValue}&refinement=${refinementValue}&paper=${paperValue}&quantity=${quantityValue}&id=${route.query.id}`)} >jetzt gestalten</Button>
            {/* <Link href={`/configure?format=${formatValue}&refinement=${refinementValue}&paper=${paperValue}&quantity=${quantityValue}&id=${route.query.id}`} ><a>Jetzt gestalten</a></Link> */}
          </div>

        </section>

      </main>
    </div>
  );
};

export default ProductDetails;

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await fetch(
    `${process.env.BACKEND_URL}/products/${context.params.id}`
  );
  if (!response.ok) {
    throw new Error("error fetching products");
  }
  const product = await response.json();
  return {
    props: {
      product,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async (context) => {
  const response = await fetch(`${process.env.BACKEND_URL}/products`);
  if (!response.ok) {
    throw new Error("error fetching products");
  }
  const products = await response.json();
  return {
    paths: products.map((product) => ({ params: { id: product.id } })),
    fallback: "blocking",
  };
};



