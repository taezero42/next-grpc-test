import type { GetStaticProps, NextPage } from 'next';
import { GreeterClient } from 'grpc/node/proto/helloworld_grpc_pb';
import { HelloRequest } from 'grpc/node/proto/helloworld_pb';
import { credentials } from '@grpc/grpc-js';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async () => {
    const client = new GreeterClient(
        '0.0.0.0:9090',
        credentials.createInsecure()
    );
    const request = new HelloRequest();
    const time = new Date().toLocaleString('ko');

    console.log(`Run SSG! : ${time}`);
    console.log(typeof window === 'undefined' ? 'Server!' : 'Client');
    request.setName(time);
    const res = await new Promise((resolve, reject) =>
        client.sayHello(request, {}, async (err, response) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            const result = response.getMessage();
            resolve(result);
        })
    );
    return {
        props: { ssg: res },
    };
};

interface Props {
    ssg?: string;
}

const SSG: NextPage = ({ ssg }: Props) => {
    return (
        <div style={{ padding: '50px' }}>
            <h1>SSG: {ssg}</h1>
            <Link href={'/'}>
                <h1 style={{ color: 'orange' }}>Home</h1>
            </Link>
        </div>
    );
};

export default SSG;
